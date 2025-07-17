import fastify from "fastify";
import {
  fastifyAppConfiguration,
  apiRoutePrefix,
} from "./configurations/global-configs";
import { userRoutes } from "./module/user/user-routes";

export const buildApp = () => {
  const app = fastify(fastifyAppConfiguration);
  app.register(userRoutes, { prefix: apiRoutePrefix });
  return app;
};
