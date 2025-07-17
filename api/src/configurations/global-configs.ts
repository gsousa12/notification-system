export const routePrefix = "/api";
export const fastifyAppConfiguration = {
  logger: false,
  ignoreTrailingSlash: true,
  ignoreDuplicateSlashes: true,
};

export const environment = {
  // fixme: use dotenv to load environment variables
  port: Number(process.env.PORT) || 3000,
};
