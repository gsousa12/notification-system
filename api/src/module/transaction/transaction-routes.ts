import { FastifyInstance } from "fastify";
import { createTransactionHandler } from "./transaction-controller";
import {
  CreateTransactionRequest,
  CreateTransactionResponse,
} from "./transaction-schema";
import { ErrorResponse } from "../user/user-schema";

const transactionRoutesPrefix = "/transaction";

export async function transactionRoutes(fastify: FastifyInstance) {
  fastify.route({
    method: "POST",
    url: `${transactionRoutesPrefix}/`,
    schema: {
      body: CreateTransactionRequest,
      response: {
        201: CreateTransactionResponse,
        400: ErrorResponse,
        404: ErrorResponse,
        500: ErrorResponse,
      },
    },
    handler: createTransactionHandler,
  });
}
