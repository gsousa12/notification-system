import { FastifyInstance } from "fastify";
import { CreateUserRequest, CreateUserResponse } from "./schema";
import { createUserHandler } from "./user-controller";

const userRoutesPrefix = "/users";

export async function userRoutes(fastify: FastifyInstance) {
  fastify.route({
    method: "POST",
    url: `${userRoutesPrefix}/`,
    schema: {
      body: CreateUserRequest,
      response: {
        201: CreateUserResponse,
      },
    },
    handler: createUserHandler,
  });
}
