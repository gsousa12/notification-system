import { Static, Type } from "@sinclair/typebox";

export const ErrorResponse = Type.Object({
  error: Type.String(),
});

export const CreateUserRequest = Type.Object({
  name: Type.String(),
  email: Type.String({ format: "email" }),
  password: Type.String({ minLength: 6 }),
  amount: Type.Number({ minimum: 100 }),
});

export const CreateUserResponse = Type.Object({
  id: Type.String(),
  name: Type.String(),
});

export const GetUserByIdRequest = Type.Object({
  id: Type.String({ format: "uuid" }),
});

export const GetUserByIdResponse = Type.Object({
  id: Type.String(),
  name: Type.String(),
  email: Type.String({ format: "email" }),
  amount: Type.Number(),
  createdAt: Type.String({ format: "date-time" }),
});

export type ErrorResponse = Static<typeof ErrorResponse>;

export type CreateUserRequest = Static<typeof CreateUserRequest>;
export type CreateUserResponse = Static<typeof CreateUserResponse>;

export type GetUserByIdRequest = Static<typeof GetUserByIdRequest>;
export type GetUserByIdResponse = Static<typeof GetUserByIdResponse>;
