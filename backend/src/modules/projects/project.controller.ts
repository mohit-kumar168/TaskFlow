import type { Request, Response } from "express";
import asyncHandler from "@/utils/asyncHandler";
import apiResponse from "@/utils/apiResponse";
import * as projectService from "./project.service";

export const createProject = asyncHandler(
	async (req: Request, res: Response) => {
		const project = await projectService.createProject(
			req.params.organizationSlug as string,
			req.params.workspaceSlug as string,
			req.user!.id,
			req.body,
		);

		return res
			.status(201)
			.json(new apiResponse("Project created successfully.", project));
	},
);

export const fetchAllProjects = asyncHandler(
	async (req: Request, res: Response) => {
		const projects = await projectService.fetchAllProjects(
			req.params.organizationSlug as string,
			req.params.workspaceSlug as string,
			req.user!.id,
		);

		return res
			.status(200)
			.json(new apiResponse("Projects fetched successfully.", projects));
	},
);

export const fetchProject = asyncHandler(
	async (req: Request, res: Response) => {
		const project = await projectService.fetchProject(
			req.params.organizationSlug as string,
			req.params.workspaceSlug as string,
			req.params.projectSlug as string,
			req.user!.id,
		);

		return res
			.status(200)
			.json(new apiResponse("Project fetched successfully.", project));
	},
);

export const updateProject = asyncHandler(
	async (req: Request, res: Response) => {
		const project = await projectService.updateProject(
			req.params.organizationSlug as string,
			req.params.workspaceSlug as string,
			req.params.projectSlug as string,
			req.user!.id,
			req.body,
		);

		return res
			.status(200)
			.json(new apiResponse("Project updated successfully.", project));
	},
);

export const removeProject = asyncHandler(
	async (req: Request, res: Response) => {
		const project = await projectService.archiveProject(
			req.params.organizationSlug as string,
			req.params.workspaceSlug as string,
			req.params.projectSlug as string,
			req.user!.id,
		);

		return res
			.status(200)
			.json(new apiResponse("Project removed successfully.", project));
	},
);

export const addMember = asyncHandler(async (req: Request, res: Response) => {
	const member = await projectService.addProjectMember(
		req.params.organizationSlug as string,
		req.params.workspaceSlug as string,
		req.params.projectSlug as string,
		req.user!.id,
		req.body,
	);

	return res
		.status(201)
		.json(new apiResponse("Member added to project successfully.", member));
});

export const fetchAllProjectMembers = asyncHandler(
	async (req: Request, res: Response) => {
		const members = await projectService.fetchAllProjectMembers(
			req.params.organizationSlug as string,
			req.params.workspaceSlug as string,
			req.params.projectSlug as string,
			req.user!.id,
		);

		return res
			.status(200)
			.json(new apiResponse("All members fetched successfully.", members));
	},
);

export const fetchProjectMember = asyncHandler(
	async (req: Request, res: Response) => {
		const member = await projectService.fetchProjectMember(
			req.params.organizationSlug as string,
			req.params.workspaceSlug as string,
			req.params.projectSlug as string,
			req.user!.id,
			req.params.memberId as string,
		);

		return res
			.status(200)
			.json(new apiResponse("Project member fetched successfully.", member));
	},
);

export const updateProjectMember = asyncHandler(
	async (req: Request, res: Response) => {
		const member = await projectService.updateProjectMember(
			req.params.organizationSlug as string,
			req.params.workspaceSlug as string,
			req.params.projectSlug as string,
			req.user!.id,
			req.params.memberId as string,
			req.body.role,
		);

		return res
			.status(200)
			.json(new apiResponse("Project member updated successfully.", member));
	},
);

export const removeProjectMember = asyncHandler(
	async (req: Request, res: Response) => {
		await projectService.removeProjectMember(
			req.params.organizationSlug as string,
			req.params.workspaceSlug as string,
			req.params.projectSlug as string,
			req.user!.id,
			req.params.memberId as string,
		);

		return res
			.status(200)
			.json(new apiResponse("Project member removed successfully.", null));
	},
);

export const fetchBoard = asyncHandler(
	async (req: Request, res: Response) => {
		const board = await projectService.fetchBoard(
			req.params.organizationSlug as string,
			req.params.workspaceSlug as string,
			req.params.projectSlug as string,
			req.user!.id,
		);

		return res
			.status(200)
			.json(
				new apiResponse(
					"Board fetched successfully.",
					board,
				),
			);
	},
);

export const updateBoard = asyncHandler(
	async (req: Request, res: Response) => {
		const board = await projectService.updateBoard(
			req.params.organizationSlug as string,
			req.params.workspaceSlug as string,
			req.params.projectSlug as string,
			req.user!.id,
			req.body.name,
		);

		return res
			.status(200)
			.json(
				new apiResponse(
					"Board updated successfully.",
					board,
				),
			);
	},
);

export const createBoardColumn = asyncHandler(
	async (req: Request, res: Response) => {
		const column = await projectService.createBoardColumn(
			req.params.organizationSlug as string,
			req.params.workspaceSlug as string,
			req.params.projectSlug as string,
			req.user!.id,
			req.body,
		);

		return res
			.status(201)
			.json(
				new apiResponse(
					"Board column created successfully.",
					column,
				),
			);
	},
);

export const fetchBoardColumns = asyncHandler(
	async (req: Request, res: Response) => {
		const columns = await projectService.fetchBoardColumns(
			req.params.organizationSlug as string,
			req.params.workspaceSlug as string,
			req.params.projectSlug as string,
			req.user!.id,
		);

		return res
			.status(200)
			.json(
				new apiResponse(
					"Board columns fetched successfully.",
					columns,
				),
			);
	},
);

export const fetchBoardColumn = asyncHandler(
	async (req: Request, res: Response) => {
		const column = await projectService.fetchBoardColumn(
			req.params.organizationSlug as string,
			req.params.workspaceSlug as string,
			req.params.projectSlug as string,
			req.user!.id,
			req.params.columnId as string,
		);

		return res
			.status(200)
			.json(
				new apiResponse(
					"Board column fetched successfully.",
					column,
				),
			);
	},
);

export const updateBoardColumn = asyncHandler(
	async (req: Request, res: Response) => {
		const column = await projectService.updateBoardColumn(
			req.params.organizationSlug as string,
			req.params.workspaceSlug as string,
			req.params.projectSlug as string,
			req.user!.id,
			req.params.columnId as string,
			req.body,
		);

		return res
			.status(200)
			.json(
				new apiResponse(
					"Board column updated successfully.",
					column,
				),
			);
	},
);

export const deleteBoardColumn = asyncHandler(
	async (req: Request, res: Response) => {
		await projectService.deleteBoardColumn(
			req.params.organizationSlug as string,
			req.params.workspaceSlug as string,
			req.params.projectSlug as string,
			req.user!.id,
			req.params.columnId as string,
		);

		return res
			.status(200)
			.json(
				new apiResponse(
					"Board column deleted successfully.",
					null,
				),
			);
	},
);
