import fastify from "fastify";
import { userRoutes } from "./routes/user/routes";
import {
  fastifyAppConfiguration,
  routePrefix,
} from "./configurations/global-configs";

export const buildApp = () => {
  const app = fastify(fastifyAppConfiguration);
  app.register(userRoutes, { prefix: routePrefix });
  return app;
};
