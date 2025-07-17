import { FastifyServerOptions } from "fastify";
import { RedisOptions } from "ioredis";
import { ConnectOptions } from "mongoose";

export const fastifyAppConfiguration: FastifyServerOptions = {
  logger: false,
  ignoreTrailingSlash: true,
  ignoreDuplicateSlashes: true,
};

export const redisConfiguration: RedisOptions = {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
};

export const mongoConfiguration: ConnectOptions = {
  dbName: "queue-db",
  serverSelectionTimeoutMS: 5000,
};

type environmentType = {
  port: number;
  mongoUri: string;
  redisUrl: string;
};

export const environment: environmentType = {
  // fixme: use dotenv to load environment variables
  port: Number(process.env.PORT) || 3000,
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/queue-db",
  redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
};
