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

// Configurações específicas para jobs de notificação
export const NOTIFICATION_JOB_OPTIONS = {
  attempts: 3,
  backoff: {
    type: "exponential" as const,
    delay: 2000, // 2s, 4s, 8s
  },
  removeOnComplete: 50, // manter últimas 50 completas
  removeOnFail: 100, // manter últimas 100 falhas para debug
};
