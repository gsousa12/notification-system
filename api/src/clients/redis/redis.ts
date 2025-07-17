import { Redis } from "ioredis";
import {
  environment,
  redisConfiguration,
} from "../../configurations/global-configs";

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
