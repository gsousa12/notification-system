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

export const createTransactionHandler = async (
  request: FastifyRequest<{ Body: CreateTransactionRequest }>,
  reply: FastifyReply
): Promise<ITransaction> => {
  try {
    const transactionId = crypto.randomUUID();
    const { senderId, receiverId, amount } = request.body;
    console.log(
      `Creating transaction: ${transactionId} from ${senderId} to ${receiverId} for amount ${amount}`
    );

    const sender = await User.findOne({ id: senderId });
    const receiver = await User.findOne({ id: receiverId });

    console.log(`Sender: ${JSON.stringify(sender)}`);
    console.log(`Receiver: ${JSON.stringify(receiver)}`);

    if (!sender || !receiver) {
      return reply.code(404).send({ error: "Sender or Receiver not found" });
    }

    if (sender.amount < amount) {
      return reply.code(400).send({ error: "Insufficient balance" });
    }

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

    return reply.code(201).send(newTransaction);
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ error: "Error creating transaction" });
  }
};
