import { Router } from "express";

import { protect } from "@/middleware/auth.middleware";
import validateRequest from "@/middleware/validateRequest.middleware";

import {
  commentSchema,
} from "./comment.validator";

import {
  createComment,
  fetchAllComments,
  updateComment,
  deleteComment,
} from "./comment.controller";

const router = Router({ mergeParams: true });

router.use(protect);

router.post(
  "/",
  validateRequest(commentSchema),
  createComment,
);

router.get(
  "/",
  fetchAllComments,
);

router.patch(
  "/:commentId",
  validateRequest(commentSchema),
  updateComment,
);

router.delete(
  "/:commentId",
  deleteComment,
);

export default router;
