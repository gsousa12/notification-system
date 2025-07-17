import { FastifyRequest, FastifyReply } from "fastify";
import { UserParamsType, UserResponseType } from "../../routes/user/schema";

export const getUserHandler = async (
  request: FastifyRequest<{ Params: UserParamsType }>
): Promise<UserResponseType> => {
  const { id } = request.params;

  return {
    id,
    name: "John Doe",
  };
};
