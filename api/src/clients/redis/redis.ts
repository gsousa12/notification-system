import { Redis, RedisOptions } from "ioredis";
import { environment } from "../../configs";

export const redisConfiguration: RedisOptions = {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
};

export const redisClient = new Redis(environment.redisUrl, redisConfiguration);

redisClient.on("connect", () => {
  console.log("✅ Redis connected");
});

redisClient.on("error", (err) => {
  console.error("❌ Redis connection error:", err);
});

redisClient.on("end", () => {
  console.log("ℹ️ Redis connection closed");
});
