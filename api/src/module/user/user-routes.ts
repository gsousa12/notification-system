import { FastifyInstance } from "fastify";
import {
  CreateUserRequest,
  CreateUserResponse,
  ErrorResponse,
  GetUserByIdRequest,
  GetUserByIdResponse,
} from "./user-schema";
import { createUserHandler, getUserByIdHandler } from "./user-controller";

const userRoutesPrefix = "/users";

export async function userRoutes(fastify: FastifyInstance) {
  fastify.route({
    method: "POST",
    url: `${userRoutesPrefix}/`,
    schema: {
      body: CreateUserRequest,
      response: {
        201: CreateUserResponse,
        409: ErrorResponse,
        500: ErrorResponse,
      },
    },
    handler: createUserHandler,
  });

  fastify.route({
    method: "GET",
    url: `${userRoutesPrefix}/:id`,
    schema: {
      params: GetUserByIdRequest,
      response: {
        200: GetUserByIdResponse,
        404: ErrorResponse,
        500: ErrorResponse,
      },
    },
    handler: getUserByIdHandler,
  });
}
