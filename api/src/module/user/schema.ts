import { Static, Type } from "@sinclair/typebox";

export const CreateUserRequest = Type.Object({
  name: Type.String(),
  email: Type.String({ format: "email" }),
  password: Type.String({ minLength: 6 }),
  amount: Type.Number({ minimum: 100 }),
});

export const CreateUserResponse = Type.Object({
  id: Type.String({ format: "uuid" }),
  name: Type.String(),
});

export type CreateUserRequest = Static<typeof CreateUserRequest>;
export type CreateUserResponse = Static<typeof CreateUserResponse>;
