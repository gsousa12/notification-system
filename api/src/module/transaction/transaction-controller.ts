import { FastifyReply, FastifyRequest } from "fastify";
import {
  CreateTransactionRequest,
  CreateTransactionResponse,
} from "./transaction-schema";
import {
  ETransactionStatus,
  ITransaction,
  Transaction,
} from "./transaction-model";
import { User } from "../user/user-model";
import {
  addNotificationJob,
  addUrgentNotificationJob,
} from "../../messaging/queues/notification.queue";
import { ENotificationType } from "../notification/notification.model";

export const createTransactionHandler = async (
  request: FastifyRequest<{ Body: CreateTransactionRequest }>,
  reply: FastifyReply
): Promise<ITransaction> => {
  const transactionId = crypto.randomUUID();
  const { senderId, receiverId, amount } = request.body;

  try {
    // 1. Validações existentes
    const sender = await User.findOne({ id: senderId });
    const receiver = await User.findOne({ id: receiverId });

    if (!sender || !receiver) {
      return reply.code(404).send({ error: "Sender or Receiver not found" });
    }

    if (sender.amount < amount) {
      return reply.code(400).send({ error: "Insufficient balance" });
    }

    // 2. 🆕 Notificação: transação enviada (imediata)
    await addNotificationJob({
      userId: senderId,
      title: "Transação Enviada",
      message: `Sua transferência de R$ ${amount.toFixed(
        2
      )} está sendo processada.`,
      type: ENotificationType.TRANSACTION_SENT,
      metadata: {
        transactionId,
        senderId,
        receiverId,
      },
    });

    // 3. Simula processamento com 30% de falha
    const success = Math.random() > 0.3; // 70% sucesso

    if (success) {
      // 3a. Processa transação (seu código existente)
      const newTransaction = await Transaction.create({
        transactionId,
        senderId,
        receiverId,
        amount,
        status: ETransactionStatus.COMPLETED,
      });

      sender.amount -= amount;
      receiver.amount += amount;
      await sender.save();
      await receiver.save();

      // 3b. 🆕 Notificações de sucesso (enfileiradas)
      await Promise.all([
        addNotificationJob({
          userId: senderId,
          title: "Transação Realizada",
          message: `Transferência de R$ ${amount.toFixed(
            2
          )} realizada com sucesso!`,
          type: ENotificationType.TRANSACTION_SUCCESS,
          metadata: { transactionId, senderId, receiverId },
        }),
        addNotificationJob({
          userId: receiverId,
          title: "Valor Recebido",
          message: `Você recebeu R$ ${amount.toFixed(2)}!`,
          type: ENotificationType.TRANSACTION_SUCCESS,
          metadata: { transactionId, senderId, receiverId },
        }),
      ]);

      return reply.code(201).send(newTransaction);
    } else {
      // 3c. Simula falha na transação
      const failedTransaction = await Transaction.create({
        transactionId,
        senderId,
        receiverId,
        amount,
        status: ETransactionStatus.FAILED,
      });

      // 3d. 🆕 Notificação de falha (alta prioridade)
      await addUrgentNotificationJob({
        userId: senderId,
        title: "Transação Falhou",
        message: `Sua transferência de R$ ${amount.toFixed(
          2
        )} não pôde ser processada. Tente novamente.`,
        type: ENotificationType.TRANSACTION_FAILED,
        metadata: { transactionId, senderId, receiverId },
      });

      return reply.code(400).send({
        error: "Transaction failed",
        transactionId,
        details: "Simulated 30% failure rate",
      });
    }
  } catch (error) {
    request.log.error(error);

    // 🆕 Notificação de erro crítico
    try {
      await addUrgentNotificationJob({
        userId: senderId,
        title: "Erro no Sistema",
        message:
          "Ocorreu um erro inesperado. Tente novamente em alguns minutos.",
        type: ENotificationType.TRANSACTION_FAILED,
        metadata: { transactionId, senderId, receiverId },
      });
    } catch (notificationError) {
      request.log.error(
        "Failed to queue error notification:",
        notificationError
      );
    }

    return reply.code(500).send({ error: "Error creating transaction" });
  }
};
