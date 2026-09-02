import type {
  Request,
  Response,
} from "express";

import asyncHandler from "@/utils/asyncHandler";
import apiResponse from "@/utils/apiResponse";

import * as notificationService from "./notification.service";

export const getNotifications =
  asyncHandler(
    async (
      req: Request,
      res: Response,
    ) => {
      const userId = req.user!.id;

      const unreadOnly =
        req.query.unreadOnly === "true";

      const notifications =
        await notificationService.fetchNotifications(
          userId,
          {
            unreadOnly,
          },
        );

      return res.status(200).json(
        new apiResponse(
          "Notifications fetched successfully.",
          notifications,
        ),
      );
    },
  );

export const markNotificationAsRead =
  asyncHandler(
    async (
      req: Request,
      res: Response,
    ) => {
      const userId = req.user!.id;

      const notificationId = req.params.notificationId as string;

      const notification = await notificationService.markNotificationAsRead(
        userId,
        notificationId,
      );

      return res.status(200).json(
        new apiResponse(
          "Notification marked as read.",
          notification,
        ),
      );
    },
  );

export const markAllNotificationsAsRead =
  asyncHandler(
    async (
      req: Request,
      res: Response,
    ) => {
      const userId = req.user!.id;

      const result =
        await notificationService.markAllNotificationsAsRead(
          userId,
        );

      return res.status(200).json(
        new apiResponse(
          "All notifications marked as read.",
          result,
        ),
      );
    },
  );
