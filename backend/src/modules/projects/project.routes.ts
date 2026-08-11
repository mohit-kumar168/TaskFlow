import { Router } from "express";
import { protect } from "@/middleware/auth.middleware";
import validateRequest from "@/middleware/validateRequest.middleware";
import {
	createProjectSchema,
	updateProjectSchema,
	addProjectMemberSchema,
	updateProjectMemberSchema,
	updateBoardSchema,
	createColumnSchema,
	updateColumnSchema,
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
	fetchBoard,
	updateBoard,
	createBoardColumn,
	fetchBoardColumns,
	fetchBoardColumn,
	updateBoardColumn,
	deleteBoardColumn,
} from "./project.controller";

const router = Router({mergeParams: true});

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


router.get(
	"/:projectSlug/board",
	fetchBoard,
);

router.patch(
	"/:projectSlug/board",
	validateRequest(updateBoardSchema),
	updateBoard,
);

router.post(
	"/:projectSlug/board/columns",
	validateRequest(createColumnSchema),
	createBoardColumn,
);

router.get(
	"/:projectSlug/board/columns",
	fetchBoardColumns,
);

router.get(
	"/:projectSlug/board/columns/:columnId",
	fetchBoardColumn,
);

router.patch(
	"/:projectSlug/board/columns/:columnId",
	validateRequest(updateColumnSchema),
	updateBoardColumn,
);

router.delete(
	"/:projectSlug/board/columns/:columnId",
	deleteBoardColumn,
);

export default router;
