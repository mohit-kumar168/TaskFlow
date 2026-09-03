import { Router } from "express";

import upload from "@/middleware/upload.middleware";

import {
  createAttachment,
  fetchAttachments,
} from "./attachment.controller";

const router = Router({
  mergeParams: true,
});

router.post(
  "/",
  upload.single("file"),
  createAttachment,
);

router.get(
  "/",
  fetchAttachments,
);

export default router;
