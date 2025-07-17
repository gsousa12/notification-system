import { Static, Type } from "@sinclair/typebox";

export const CreateTransactionRequest = Type.Object({
  senderId: Type.String({ format: "uuid" }),
  receiverId: Type.String({ format: "uuid" }),
  amount: Type.Number({ minimum: 0 }),
});

export const CreateTransactionResponse = Type.Object({
  transactionId: Type.String({ format: "uuid" }),
  status: Type.String(),
  createdAt: Type.String({ format: "date-time" }),
});

export type CreateTransactionRequest = Static<typeof CreateTransactionRequest>;
export type CreateTransactionResponse = Static<
  typeof CreateTransactionResponse
>;
