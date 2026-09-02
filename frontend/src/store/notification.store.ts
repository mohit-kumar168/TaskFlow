import { create } from "zustand";

import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  type Notification,
} from "../api/notification.api";

interface NotificationState {
  notifications: Notification[];
  loading: boolean;

  fetchNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

export const useNotificationStore =
  create<NotificationState>((set) => ({
    notifications: [],
    loading: false,

    fetchNotifications: async () => {
      try {
        set({ loading: true });

        const response = await fetchNotifications();

        set({
          notifications: response.data.data,
        });
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        set({ loading: false });
      }
    },

    markAsRead: async (notificationId: string) => {
      try {
        await markNotificationAsRead(notificationId);

        set((state) => ({
          notifications: state.notifications.map(
            (notification) =>
              notification.id === notificationId
                ? {
                  ...notification,
                  isRead: true,
                }
                : notification,
          ),
        }));
      } catch (error) {
        console.error(
          "Failed to mark notification as read:",
          error,
        );
      }
    },

    markAllAsRead: async () => {
      try {
        await markAllNotificationsAsRead();

        set((state) => ({
          notifications: state.notifications.map(
            (notification) => ({
              ...notification,
              isRead: true,
            }),
          ),
        }));
      } catch (error) {
        console.error(
          "Failed to mark all notifications as read:",
          error,
        );
      }
    },
  }));
