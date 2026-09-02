import { Router } from "express";

import * as notificationController from "./notification.controller";
import { protect } from "@/middleware/auth.middleware";

const router = Router();

router.use(protect);

router.get(
  "/",
  notificationController.getNotifications,
);

router.patch(
  "/:notificationId/read",
  notificationController.markNotificationAsRead,
);

router.patch(
  "/read-all",
  notificationController.markAllNotificationsAsRead,
);

export default router;
