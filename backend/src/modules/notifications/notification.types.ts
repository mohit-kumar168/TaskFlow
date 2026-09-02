export interface CreateNotificationInput {
  userId: string;
  title: string;
  message: string;
  link?: string;
}

export interface NotificationQuery {
  unreadOnly?: boolean;
}

