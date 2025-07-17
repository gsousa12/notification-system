import { FastifyInstance } from "fastify";
import { UserParams, UserResponse } from "./schema";
import { getUserHandler } from "../../controllers/user/user-controller";

export async function userRoutes(fastify: FastifyInstance) {
  fastify.route({
    method: "GET",
    url: "/users/:id",
    schema: {
      params: UserParams,
      response: {
        200: UserResponse,
      },
    },
    handler: getUserHandler,
  });
}
