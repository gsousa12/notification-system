import { Worker, Job } from "bullmq";
import { redisClient } from "../../clients/redis/redis"; // ajuste o path
import {
  CreateNotificationJob,
  NotificationJobResult,
} from "../jobs/notification.job";
import { Notification } from "../../module/notification/notification.model";
import { FastifyInstance } from "fastify";

export class NotificationWorker {
  private worker: Worker;
  private fastifyApp: FastifyInstance;

  constructor(fastifyApp: FastifyInstance) {
    this.fastifyApp = fastifyApp;

    this.worker = new Worker<CreateNotificationJob, NotificationJobResult>(
      "notifications",
      this.processNotification.bind(this),
      {
        connection: redisClient,
        concurrency: 5,
      }
    );

    this.setupEventListeners();
  }

  private async processNotification(
    job: Job<CreateNotificationJob>
  ): Promise<NotificationJobResult> {
    const { userId, title, message, type, metadata } = job.data;
    const notificationId = crypto.randomUUID();

    try {
      const notification = new Notification({
        notificationId,
        userId,
        title,
        message,
        type,
        read: false,
        metadata,
      });

      await notification.save();
      this.fastifyApp.log.info(`📬 Notificação salva: ${notificationId}`);

      let sentViaWebSocket = false;
      try {
        this.fastifyApp.notify(userId, {
          notificationId,
          title,
          message,
          type,
          metadata,
        });
        sentViaWebSocket = true;
        this.fastifyApp.log.info(`🔔 WebSocket enviado para user: ${userId}`);
      } catch (wsError) {
        this.fastifyApp.log.warn(
          `⚠️ WebSocket falhou para user ${userId}:`,
          wsError
        );
      }

      return {
        notificationId,
        success: true,
        sentViaWebSocket,
      };
    } catch (error) {
      this.fastifyApp.log.error(`❌ Erro ao processar notificação:`, error);
      throw new Error(
        `Failed to process notification: ${(error as any).message}`
      );
    }
  }

  private setupEventListeners() {
    this.worker.on("completed", (job, result: NotificationJobResult) => {
      this.fastifyApp.log.info(
        `✅ Job ${job.id} completed: ${result.notificationId} (WS: ${result.sentViaWebSocket})`
      );
    });

    this.worker.on("failed", (job, err) => {
      this.fastifyApp.log.error(`❌ Job ${job?.id} failed:`, err.message);
    });
  }

  async close() {
    await this.worker.close();
  }
}

export const createNotificationWorker = (fastifyApp: FastifyInstance) => {
  return new NotificationWorker(fastifyApp);
};
