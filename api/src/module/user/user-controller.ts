import { FastifyReply, FastifyRequest } from "fastify";
import { CreateUserRequest, CreateUserResponse } from "./user-schema";
import { User } from "./user-model";

export const createUserHandler = async (
  request: FastifyRequest<{ Body: CreateUserRequest }>,
  reply: FastifyReply
) => {
  try {
    const { name, email, password, amount } = request.body;

    if (await User.findOne({ email })) {
      return reply.code(409).send({ error: "Email already registered" });
    }

    const newUser = await User.create({ name, email, password, amount });

    const response: CreateUserResponse = {
      id: (newUser._id as string).toString(),
      name: newUser.name,
    };

    return reply.code(201).send(response);
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ error: "Error creating user" });
  }
};
