import mongoose, { ConnectOptions } from "mongoose";
import { environment } from "../../configs";

export const mongoConfiguration: ConnectOptions = {
  dbName: "queue-db",
  serverSelectionTimeoutMS: 5000,
};

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(environment.mongoUri, mongoConfiguration);

    console.log("✅ MongoDB connected successfully");

    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("ℹ️ MongoDB disconnected");
    });
  } catch (err) {
    console.error("❌ MongoDB initial connection error:", err);
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  await mongoose.disconnect();
  console.log("ℹ️ MongoDB disconnected gracefully");
};
