import { FastifyReply, FastifyRequest } from "fastify";
import { INotification, Notification } from "./notification.model";
import {
  CreateNotificationRequest,
  GetNotificationsParams,
  GetNotificationsQuery,
  MarkAllAsReadParams,
  MarkAsReadParams,
  UnreadCountParams,
} from "./notification.schema";

export const createNotificationHandler = async (
  request: FastifyRequest<{ Body: CreateNotificationRequest }>,
  reply: FastifyReply
) => {
  const notificationId = crypto.randomUUID();
  const { userId, title, message, type, metadata } = request.body;

  try {
    const newNotification = new Notification({
      notificationId,
      userId,
      title,
      message,
      type,
      read: false,
      metadata,
    });

    const savedNotification = await newNotification.save();

    return reply.code(201).send({
      notificationId: savedNotification.notificationId,
      title: savedNotification.title,
      message: savedNotification.message,
    });
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ error: "Error creating notification" });
  }
};

export const getNotificationsHandler = async (
  request: FastifyRequest<{
    Params: GetNotificationsParams;
    Querystring: GetNotificationsQuery;
  }>,
  reply: FastifyReply
) => {
  const { userId } = request.params;
  const { page = 1, limit = 20, unreadOnly = false } = request.query;

  try {
    const skip = (page - 1) * limit;
    const filter: any = { userId };

    if (unreadOnly) {
      filter.read = false;
    }

    const [notifications, total] = await Promise.all([
      Notification.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Notification.countDocuments(filter),
    ]);

    return reply.send({
      notifications,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ error: "Error fetching notifications" });
  }
};

export const markAsReadHandler = async (
  request: FastifyRequest<{
    Params: MarkAsReadParams;
  }>,
  reply: FastifyReply
) => {
  const { notificationId, userId } = request.params;

  try {
    const updatedNotification = await Notification.findOneAndUpdate(
      { notificationId, userId },
      { read: true },
      { new: true, select: "-_id -__v" }
    );

    if (!updatedNotification) {
      return reply.code(404).send({ error: "Notification not found" });
    }

    return reply.send({
      notificationId: updatedNotification.notificationId,
      read: updatedNotification.read,
    });
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ error: "Error updating notification" });
  }
};

export const markAllAsReadHandler = async (
  request: FastifyRequest<{
    Params: MarkAllAsReadParams;
  }>,
  reply: FastifyReply
) => {
  const { userId } = request.params;

  try {
    const result = await Notification.updateMany(
      { userId, read: false },
      { read: true }
    );

    return reply.send({
      message: `${result.modifiedCount} notifications marked as read`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ error: "Error updating notifications" });
  }
};

export const getUnreadCountHandler = async (
  request: FastifyRequest<{
    Params: UnreadCountParams;
  }>,
  reply: FastifyReply
) => {
  const { userId } = request.params;

  try {
    const unreadCount = await Notification.countDocuments({
      userId,
      read: false,
    });

    return reply.send({ unreadCount });
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ error: "Error counting notifications" });
  }
};
