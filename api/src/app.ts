import fastify, { FastifyServerOptions } from "fastify";
import { userRoutes } from "./module/user/user-routes";
import { transactionRoutes } from "./module/transaction/transaction-routes";
import websocketPlugin from "./adapters/websocket/websocket";
import { notificationRoutes } from "./module/notification/notification.routes";

export const fastifyAppConfiguration: FastifyServerOptions = {
  logger: true,
  ignoreTrailingSlash: true,
  ignoreDuplicateSlashes: true,
};

const apiRoutePrefix: string = "/api";

export const buildApp = () => {
  const app = fastify(fastifyAppConfiguration);
  app.register(websocketPlugin);
  app.register(userRoutes, { prefix: apiRoutePrefix });
  app.register(transactionRoutes, { prefix: apiRoutePrefix });
  app.register(notificationRoutes, { prefix: apiRoutePrefix });
  return app;
};
