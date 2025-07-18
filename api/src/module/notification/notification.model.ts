// src/models/notification.model.ts
import { Schema, model, Document } from "mongoose";

export enum ENotificationType {
  TRANSACTION_SENT = "transaction_sent",
  TRANSACTION_SUCCESS = "transaction_success",
  TRANSACTION_FAILED = "transaction_failed",
}

export type NotificationMetadata = {
  transactionId?: string;
  senderId?: string;
  receiverId?: string;
};

export interface INotification extends Document {
  notificationId: string;
  userId: string;
  title: string;
  message: string;
  type: ENotificationType;
  read: boolean;
  metadata?: NotificationMetadata;
}

const notificationSchema = new Schema<INotification>(
  {
    notificationId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 100,
    },
    message: {
      type: String,
      required: true,
      maxlength: 500,
    },
    type: {
      type: String,
      required: true,
      enum: Object.values(ENotificationType),
      index: true,
    },
    read: {
      type: Boolean,
      default: false,
      index: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "notifications",
  }
);

// Índice composto para consultas otimizadas
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, read: 1 });

export const Notification = model<INotification>(
  "Notification",
  notificationSchema
);
