import { environment } from "./configs";
import { buildApp } from "./app";
import { connectDB, disconnectDB } from "./clients/db/db";
import { redisClient } from "./clients/redis/redis";
import { createNotificationWorker } from "./messaging/workers/notification.worker";

const start = async () => {
  try {
    await connectDB();
    await redisClient.ping();

    const app = buildApp();

    const notificationWorker = createNotificationWorker(app);
    console.log("📬 Notification worker started");

    await app.listen({
      port: 3000,
      host: "0.0.0.0",
    });

    console.log(`🚀 Server running on http://localhost:${environment.port}`);

    process.on("SIGINT", async () => {
      console.log("🛑 Shutting down gracefully...");

      // Fecha worker primeiro (para não aceitar novos jobs)
      await notificationWorker.close();
      console.log("📬 Notification worker closed");

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
