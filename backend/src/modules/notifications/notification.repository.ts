import prisma from "@/prisma/client";

import type {
  CreateNotificationInput,
  NotificationQuery,
} from "./notification.types";

export const createNotification = async (
  data: CreateNotificationInput,
) => {
  return await prisma.notification.create({
    data: {
      userId: data.userId,
      title: data.title,
      message: data.message,
      link: data.link,
    },
  });
};

export const fetchNotifications = async (
  userId: string,
  query?: NotificationQuery,
) => {
  return await prisma.notification.findMany({
    where: {
      userId,

      ...(query?.unreadOnly && {
        isRead: false,
      }),
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};

export const findNotificationById = async (
  notificationId: string,
  userId: string,
) => {
  return await prisma.notification.findFirst({
    where: {
      id: notificationId,
      userId,
    },
  });
};

export const markNotificationAsRead = async (
  notificationId: string,
) => {
  return await prisma.notification.update({
    where: {
      id: notificationId,
    },

    data: {
      isRead: true,
    },
  });
};

export const markAllNotificationsAsRead = async (
  userId: string,
) => {
  return await prisma.notification.updateMany({
    where: {
      userId,
      isRead: false,
    },

    data: {
      isRead: true,
    },
  });
};
