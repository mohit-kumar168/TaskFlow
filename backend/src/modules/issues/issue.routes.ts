import { Router } from "express";
import { protect } from "@/middleware/auth.middleware";
import { fetchAllIssues, fetchIssue, createIssue, updateIssue, removeIssue } from "./issue.controller";

const router = Router();

router.use(protect)

router.post("/:projectId/issues", createIssue);
router.get("/:projectId/issues", fetchAllIssues);
router.get("/:projectId/issues/:issueId", fetchIssue);
router.patch("/:projectId/issues/:issueId", updateIssue);
router.delete("/:projectId/issues/:issueId", removeIssue);

export default router;
