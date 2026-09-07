import { Router } from "express";

import {
  getIssueStatusReport,
  getIssuePriorityReport,
  getIssueTrendReport,
  getSprintProgressReport,
} from "./report.controller";

const router = Router();

router.get(
  "/issue-status",
  getIssueStatusReport,
);

router.get(
  "/issue-priority",
  getIssuePriorityReport,
);

router.get(
  "/issue-trend",
  getIssueTrendReport,
);

router.get(
  "/sprint-progress",
  getSprintProgressReport,
);

export default router;
