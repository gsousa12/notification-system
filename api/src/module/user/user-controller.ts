import { FastifyRequest } from "fastify";
import { CreateUserRequest, CreateUserResponse } from "./schema";

type createUserRequestType = { Body: CreateUserRequest };

export const createUserHandler = async (
  request: FastifyRequest<createUserRequestType>
): Promise<CreateUserResponse> => {
  return {
    id: "123e4567-e89b-12d3-a456-426614174000", // Example UUID
    name: request.body.name,
  };
};
