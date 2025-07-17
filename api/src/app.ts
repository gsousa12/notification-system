import fastify from "fastify";
import { fastifyAppConfiguration } from "./configurations/global-configs";
import { userRoutes } from "./module/user/user-routes";
import { transactionRoutes } from "./module/transaction/transaction-routes";

const apiRoutePrefix: string = "/api";

export const buildApp = () => {
  const app = fastify(fastifyAppConfiguration);
  app.register(userRoutes, { prefix: apiRoutePrefix });
  app.register(transactionRoutes, { prefix: apiRoutePrefix });
  return app;
};
