import { createWorkspace, deleteWorkspace, fetchAllWorkspaces, fetchWorkspace } from "@/controllers/workspace.controller";
import { protect } from "@/middleware/auth.middleware";
import { Router } from "express";

const router = Router();

router.use(protect);

router.post("/", createWorkspace);
router.get("/", fetchAllWorkspaces);
router.get("/:workspaceId", fetchWorkspace);
router.delete("/:workspaceId", deleteWorkspace);

export default router;
