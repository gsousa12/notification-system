import { Static, Type } from "@sinclair/typebox";

export const UserParams = Type.Object({
  id: Type.String({ format: "uuid" }),
});

export const UserResponse = Type.Object({
  id: Type.String(),
  name: Type.String(),
});

export type UserParamsType = Static<typeof UserParams>;
export type UserResponseType = Static<typeof UserResponse>;
