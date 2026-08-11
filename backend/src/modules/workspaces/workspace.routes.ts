import { Router } from "express";
import { protect } from "@/middleware/auth.middleware";
import validateRequest from "@/middleware/validateRequest.middleware";

import {
	createWorkspace,
	fetchAllWorkspaces,
	fetchWorkspace,
	updateWorkspace,
	archiveWorkspace,
	addWorkspaceMember,
	fetchAllWorkspaceMembers,
	fetchWorkspaceMember,
	updateWorkspaceMemberRole,
	removeWorkspaceMember,
} from "./workspace.controller";

import {
	createWorkspaceSchema,
	updateWorkspaceSchema,
	addWorkspaceMemberSchema,
	updateWorkspaceMemberRoleSchema,
} from "./workspace.validator";

const router = Router({mergeParams: true});


router.use(protect);

router.post(
	"/",
	validateRequest(createWorkspaceSchema),
	createWorkspace,
);

router.get(
	"/",
	fetchAllWorkspaces,
);

router.get(
	"/:workspaceSlug",
	fetchWorkspace,
);

router.patch(
	"/:workspaceSlug",
	validateRequest(updateWorkspaceSchema),
	updateWorkspace,
);

router.delete(
	"/:workspaceSlug",
	archiveWorkspace,
);


router.post(
	"/:workspaceSlug/members",
	validateRequest(addWorkspaceMemberSchema),
	addWorkspaceMember,
);

router.get(
	"/:workspaceSlug/members",
	fetchAllWorkspaceMembers,
);

router.get(
	"/:workspaceSlug/members/:memberId",
	fetchWorkspaceMember,
);

router.patch(
	"/:workspaceSlug/members/:memberId",
	validateRequest(updateWorkspaceMemberRoleSchema),
	updateWorkspaceMemberRole,
);

router.delete(
	"/:workspaceSlug/members/:memberId",
	removeWorkspaceMember,
);

export default router;
