import mongoose, { Document, Schema } from "mongoose";

export enum ETransactionStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
}

export interface ITransaction extends Document {
  transactionId: string;
  senderId: string;
  receiverId: string;
  amount: number;
  status: ETransactionStatus;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    transactionId: {
      type: String,
      required: [true, "Transaction ID is required"],
      unique: true,
      trim: true,
    },
    senderId: {
      type: String,
      required: [true, "Sender ID is required"],
      trim: true,
    },
    receiverId: {
      type: String,
      required: [true, "Receiver ID is required"],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount must be a positive number"],
    },
    status: {
      type: String,
      enum: Object.values(ETransactionStatus),
      default: ETransactionStatus.PENDING,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Transaction = mongoose.model<ITransaction>(
  "Transaction",
  TransactionSchema
);
