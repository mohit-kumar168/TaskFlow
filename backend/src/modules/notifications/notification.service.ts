import apiError from "@/utils/apiError";

import * as notificationRepository from "./notification.repository";
import type {
  CreateNotificationInput,
  NotificationQuery,
} from "./notification.types";

export const createNotification = async (
  data: CreateNotificationInput,
) => {
  return await notificationRepository.createNotification(
    data,
  );
};

export const fetchNotifications = async (
  userId: string,
  query?: NotificationQuery,
) => {
  return await notificationRepository.fetchNotifications(
    userId,
    query,
  );
};

export const markNotificationAsRead = async (
  userId: string,
  notificationId: string,
) => {
  const notification =
    await notificationRepository.findNotificationById(
      notificationId,
      userId,
    );

  if (!notification) {
    throw new apiError(
      404,
      "Notification not found.",
    );
  }

  return await notificationRepository.markNotificationAsRead(
    notification.id,
  );
};

export const markAllNotificationsAsRead = async (
  userId: string,
) => {
  return await notificationRepository.markAllNotificationsAsRead(
    userId,
  );
};
