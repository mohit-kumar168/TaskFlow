import { createWorkspace, deleteWorkspace, fetchAllWorkspaces, fetchWorkspace } from "@/controllers/workspace.controller";
import { addMember, fetchAllMembers, removeMember, updateMemberRole } from "@/controllers/workspaceMember.controller";
import { protect } from "@/middleware/auth.middleware";
import { Router } from "express";

const router = Router();

router.use(protect);

router.post("/", createWorkspace);
router.get("/", fetchAllWorkspaces);
router.get("/:workspaceId", fetchWorkspace);
router.delete("/:workspaceId", deleteWorkspace);

router.post("/:workspaceId/members", addMember);
router.get("/:workspaceId/members", fetchAllMembers);
router.patch("/:workspaceId/members/:memberId", updateMemberRole);
router.delete("/:workspaceId/members/:memberId", removeMember);

export default router;
