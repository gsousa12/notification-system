import { FastifyInstance } from "fastify";
import {
  CreateNotificationRequest,
  CreateNotificationResponse,
  GetNotificationsQuery,
  GetNotificationsParams,
  GetNotificationsResponse,
  MarkAsReadParams,
  MarkAsReadResponse,
  MarkAllAsReadParams,
  MarkAllAsReadResponse,
  UnreadCountParams,
  UnreadCountResponse,
} from "./notification.schema";
import { ErrorResponse } from "../user/user-schema";
import {
  createNotificationHandler,
  getNotificationsHandler,
  markAsReadHandler,
  markAllAsReadHandler,
  getUnreadCountHandler,
} from "./notification.controller";

const notificationRoutesPrefix = "/notification";

export async function notificationRoutes(fastify: FastifyInstance) {
  // Criar notificação
  fastify.route({
    method: "POST",
    url: `${notificationRoutesPrefix}/`,
    schema: {
      body: CreateNotificationRequest,
      response: {
        201: CreateNotificationResponse,
        400: ErrorResponse,
        500: ErrorResponse,
      },
    },
    handler: createNotificationHandler,
  });

  // Listar notificações do usuário
  fastify.route({
    method: "GET",
    url: `${notificationRoutesPrefix}/user/:userId`,
    schema: {
      params: GetNotificationsParams, // 🆕 usando TypeBox
      querystring: GetNotificationsQuery,
      response: {
        200: GetNotificationsResponse,
        400: ErrorResponse,
        500: ErrorResponse,
      },
    },
    handler: getNotificationsHandler,
  });

  // Marcar notificação como lida
  fastify.route({
    method: "PATCH",
    url: `${notificationRoutesPrefix}/user/:userId/:notificationId/read`,
    schema: {
      params: MarkAsReadParams, // 🆕 usando TypeBox
      response: {
        200: MarkAsReadResponse,
        404: ErrorResponse,
        500: ErrorResponse,
      },
    },
    handler: markAsReadHandler,
  });

  // Marcar todas como lidas
  fastify.route({
    method: "PATCH",
    url: `${notificationRoutesPrefix}/user/:userId/read-all`,
    schema: {
      params: MarkAllAsReadParams, // 🆕 usando TypeBox
      response: {
        200: MarkAllAsReadResponse,
        500: ErrorResponse,
      },
    },
    handler: markAllAsReadHandler,
  });

  // Contar não lidas
  fastify.route({
    method: "GET",
    url: `${notificationRoutesPrefix}/user/:userId/unread-count`,
    schema: {
      params: UnreadCountParams, // 🆕 usando TypeBox
      response: {
        200: UnreadCountResponse,
        500: ErrorResponse,
      },
    },
    handler: getUnreadCountHandler,
  });
}
