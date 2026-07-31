import { Router } from "express";
import { protect } from "../middleware/auth.middleware"
import { fetchAllProjects, fetchProject, removeProject, updateProject, createProject } from "@/controllers/project.controller";
import { addMember, fetchAllProjectMembers, fetchProjectMember, removeProjectMember, updateProjectMember } from "@/controllers/projectMember.controller";

const router = Router();

router.use(protect);

router.post("/:workspaceId/projects", createProject);
router.get("/:workspaceId/projects", fetchAllProjects);
router.get("/:workspaceId/projects/:projectId", fetchProject);
router.patch("/:workspaceId/projects/:projectId", updateProject);
router.delete("/:workspaceId/projects/:projectId", removeProject);

router.post("/:workspaceId/projects/:projectId/members", addMember);
router.get("/:workspaceId/projects/:projectId/members", fetchAllProjectMembers);
router.get("/:workspaceId/projects/:projectId/members/:memberId", fetchProjectMember);
router.patch("/:workspaceId/projects/:projectId/members/:memberId", updateProjectMember);
router.delete("/:workspaceId/projects/:projectId/members/:memberId", removeProjectMember);

export default router;
