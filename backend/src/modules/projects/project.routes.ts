import { Router } from "express";
import { protect } from "@/middleware/auth.middleware";
import validateRequest from "@/middleware/validateRequest.middleware";
import {
  createProjectSchema,
  updateProjectSchema,
  addProjectMemberSchema,
  updateProjectMemberSchema,
} from "./project.validator";

import {
  createProject,
  fetchAllProjects,
  fetchProject,
  updateProject,
  removeProject,
  addMember,
  fetchAllProjectMembers,
  fetchProjectMember,
  updateProjectMember,
  removeProjectMember,
} from "./project.controller";

const router = Router();

router.use(protect);

// Project
router.post(
    "/", 
    validateRequest(createProjectSchema), 
    createProject
);

router.get(
    "/", 
    fetchAllProjects
);

router.get(
    "/:projectSlug", 
    fetchProject
);

router.patch(
  "/:projectSlug",
  validateRequest(updateProjectSchema),
  updateProject,
);

router.delete(
    "/:projectSlug", 
    removeProject
);

router.post(
  "/:projectSlug/members",
  validateRequest(addProjectMemberSchema),
  addMember,
);

router.get(
    "/:projectSlug/members", 
    fetchAllProjectMembers
);
router.get(
    "/:projectSlug/members/:memberId", 
    fetchProjectMember
);
router.patch(
  "/:projectSlug/members/:memberId",
  validateRequest(updateProjectMemberSchema),
  updateProjectMember,
);

router.delete(
    "/:projectSlug/members/:memberId", 
    removeProjectMember
);

export default router;
