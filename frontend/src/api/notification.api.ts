import { api } from "./axios";

export interface Notification {
  id: string;
  title: string;
  message: string;
  link?: string | null;
  isRead: boolean;
  createdAt: string;
}

export const fetchNotifications = async () => {
  return api.get("/notifications");

};

export const markNotificationAsRead = async (
  notificationId: string,
) => {
  return api.patch(
    `/notifications/${notificationId}/read`,
  );
};

export const markAllNotificationsAsRead = async () => {
  return api.patch(
    "/notifications/read-all",
  );
};
