import {
  ENotificationType,
  NotificationMetadata,
} from "../../module/notification/notification.model";

export interface CreateNotificationJob {
  userId: string;
  title: string;
  message: string;
  type: ENotificationType;
  metadata?: NotificationMetadata;
}

export interface NotificationJobResult {
  notificationId: string;
  success: boolean;
  sentViaWebSocket: boolean;
  error?: string;
}

export const NOTIFICATION_JOB_OPTIONS = {
  attempts: 3,
  backoff: {
    type: "exponential" as const,
    delay: 2000,
  },
  removeOnComplete: 50,
  removeOnFail: 100,
};
