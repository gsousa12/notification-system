import { Queue } from "bullmq";
import {
  CreateNotificationJob,
  NOTIFICATION_JOB_OPTIONS,
} from "../jobs/notification.job";
import { redisClient } from "../../clients/redis/redis";

export const notificationQueue = new Queue<CreateNotificationJob>(
  "notifications",
  {
    connection: redisClient,
    defaultJobOptions: NOTIFICATION_JOB_OPTIONS,
  }
);

export const addNotificationJob = async (
  jobData: CreateNotificationJob,
  options?: {
    priority?: number;
    delay?: number;
  }
) => {
  return await notificationQueue.add("create-notification", jobData, {
    ...NOTIFICATION_JOB_OPTIONS,
    ...options,
  });
};

export const addUrgentNotificationJob = async (
  jobData: CreateNotificationJob
) => {
  return await addNotificationJob(jobData, { priority: 10 });
};
