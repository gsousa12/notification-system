import { FastifyReply, FastifyRequest } from "fastify";
import {
  CreateUserRequest,
  CreateUserResponse,
  GetUserByIdRequest,
} from "./user-schema";
import { IUser, User } from "./user-model";

export const createUserHandler = async (
  request: FastifyRequest<{ Body: CreateUserRequest }>,
  reply: FastifyReply
): Promise<CreateUserResponse> => {
  try {
    const id = crypto.randomUUID();
    const { name, email, password, amount } = request.body;

    if (await User.findOne({ email })) {
      return reply.code(409).send({ error: "Email already registered" });
    }

    const newUser = await User.create({
      id,
      name,
      email,
      password,
      amount,
    });

    const response: CreateUserResponse = {
      id: newUser.id,
      name: newUser.name,
    };

    return reply.code(201).send(response);
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ error: "Error creating user" });
  }
};

export const getUserByIdHandler = async (
  request: FastifyRequest<{ Params: GetUserByIdRequest }>,
  reply: FastifyReply
): Promise<IUser> => {
  try {
    const { id } = request.params;
    const user = await User.findOne({ id });

    if (!user) {
      return reply.code(404).send({ error: "User not found" });
    }

    return reply.code(200).send(user);
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ error: error });
  }
};
