import { FastifyInstance } from "fastify";
import {
  CreateNotificationRequest,
  CreateNotificationResponse,
  GetNotificationsQuery,
  GetNotificationsResponse,
  MarkAsReadParams,
  MarkAsReadResponse,
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

  fastify.route({
    method: "GET",
    url: `${notificationRoutesPrefix}/user/:userId`,
    schema: {
      params: { userId: { type: "string", format: "uuid" } },
      querystring: GetNotificationsQuery,
      response: {
        200: GetNotificationsResponse,
        400: ErrorResponse,
        500: ErrorResponse,
      },
    },
    handler: getNotificationsHandler,
  });

  fastify.route({
    method: "PATCH",
    url: `${notificationRoutesPrefix}/user/:userId/:notificationId/read`,
    schema: {
      params: MarkAsReadParams,
      response: {
        200: MarkAsReadResponse,
        404: ErrorResponse,
        500: ErrorResponse,
      },
    },
    handler: markAsReadHandler,
  });

  fastify.route({
    method: "PATCH",
    url: `${notificationRoutesPrefix}/user/:userId/read-all`,
    schema: {
      params: { userId: { type: "string", format: "uuid" } },
      response: {
        200: {
          type: "object",
          properties: {
            message: { type: "string" },
            modifiedCount: { type: "integer" },
          },
        },
        500: ErrorResponse,
      },
    },
    handler: markAllAsReadHandler,
  });

  fastify.route({
    method: "GET",
    url: `${notificationRoutesPrefix}/user/:userId/unread-count`,
    schema: {
      params: { userId: { type: "string", format: "uuid" } },
      response: {
        200: UnreadCountResponse,
        500: ErrorResponse,
      },
    },
    handler: getUnreadCountHandler,
  });
}
