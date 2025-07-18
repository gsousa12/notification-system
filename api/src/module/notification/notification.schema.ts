import { Static, Type } from "@sinclair/typebox";
import { ENotificationType } from "./notification.model";

export const CreateNotificationRequest = Type.Object({
  userId: Type.String({ format: "uuid" }),
  title: Type.String({ maxLength: 100 }),
  message: Type.String({ maxLength: 500 }),
  type: Type.Enum(ENotificationType),
  metadata: Type.Optional(Type.Any()),
});

export const CreateNotificationResponse = Type.Object({
  notificationId: Type.String({ format: "uuid" }),
  title: Type.String(),
  message: Type.String(),
  createdAt: Type.String({ format: "date-time" }),
});

export const GetNotificationsQuery = Type.Object({
  page: Type.Optional(Type.Integer({ minimum: 1, default: 1 })),
  limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 100, default: 20 })),
  unreadOnly: Type.Optional(Type.Boolean({ default: false })),
});

export const GetNotificationsResponse = Type.Object({
  notifications: Type.Array(
    Type.Object({
      notificationId: Type.String(),
      userId: Type.String(),
      title: Type.String(),
      message: Type.String(),
      type: Type.Enum(ENotificationType),
      read: Type.Boolean(),
      metadata: Type.Optional(Type.Any()),
      createdAt: Type.String({ format: "date-time" }),
      updatedAt: Type.String({ format: "date-time" }),
    })
  ),
  pagination: Type.Object({
    total: Type.Integer(),
    page: Type.Integer(),
    limit: Type.Integer(),
    totalPages: Type.Integer(),
  }),
});

export const MarkAsReadParams = Type.Object({
  userId: Type.String({ format: "uuid" }),
  notificationId: Type.String({ format: "uuid" }),
});

export const MarkAsReadResponse = Type.Object({
  notificationId: Type.String(),
  read: Type.Boolean(),
  updatedAt: Type.String({ format: "date-time" }),
});

export const UnreadCountResponse = Type.Object({
  unreadCount: Type.Integer(),
});

export type CreateNotificationRequest = Static<
  typeof CreateNotificationRequest
>;
export type GetNotificationsQuery = Static<typeof GetNotificationsQuery>;
export type MarkAsReadParams = Static<typeof MarkAsReadParams>;
