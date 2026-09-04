import { Router } from "express";


import {
  createIssueSchema,
  updateIssueSchema,
  moveIssueSchema,
} from "./issue.validator";

import {
  createIssue,
  fetchAllIssues,
  fetchIssue,
  updateIssue,
  moveIssue,
  archiveIssue,
} from "./issue.controller";
import attachmentRouter from "@/modules/attachments/attachment.routes"
import validateRequest from "@/middleware/validateRequest.middleware";

const router = Router({ mergeParams: true });

router.post(
  "/",
  validateRequest(createIssueSchema),
  createIssue,
);

router.get(
  "/",
  fetchAllIssues,
);

router.get(
  "/:issueId",
  fetchIssue,
);

router.patch(
  "/:issueId",
  validateRequest(updateIssueSchema),
  updateIssue,
);

router.patch(
  "/:issueId/move",
  validateRequest(moveIssueSchema),
  moveIssue,
);

router.delete(
  "/:issueId",
  archiveIssue,
);

router.use(
  "/:issueId/attachments",
  attachmentRouter,
);

export default router;
