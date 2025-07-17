import { environment } from "./configurations/global-configs";
import { buildApp } from "./app";
import { connectDB, disconnectDB } from "./clients/db/db";
import { redisClient } from "./clients/redis/redis";

const start = async () => {
  try {
    await connectDB();
    await redisClient.ping();

    const app = buildApp();

    await app.listen({
      port: environment.port,
      host: "0.0.0.0",
    });

    console.log(`🚀 Server running on http://localhost:${environment.port}`);

    process.on("SIGINT", async () => {
      await app.close();
      await disconnectDB();
      await redisClient.quit();
      process.exit(0);
    });
  } catch (err) {
    console.error("❌ Server startup error:", err);
    process.exit(1);
  }
};

start();
