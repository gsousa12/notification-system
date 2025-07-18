import fastify, { FastifyServerOptions } from "fastify";
import { userRoutes } from "./module/user/user-routes";
import { transactionRoutes } from "./module/transaction/transaction-routes";
import websocketPlugin from "./adapters/websocket/websocket";

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
  app.get("/debug/notify", async (req, reply) => {
    const { userId = "test" } = req.query as { userId?: string };
    app.notify(userId, { title: "Ping!", message: "Hello WS" });
    return reply.send({ ok: true });
  });
  app.printRoutes();
  return app;
};
