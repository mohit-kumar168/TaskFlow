import type { Request, Response } from "express";
import asyncHandler from "@/utils/asyncHandler";
import apiResponse from "@/utils/apiResponse";
import * as workspaceService from "./workspace.service";

export const createWorkspace = asyncHandler(
	async (req: Request, res: Response) => {
		const workspace = await workspaceService.createWorkspace(
			req.params.organizationSlug as string,
			req.user!.id,
			req.body,
		);

		return res.status(201).json(
			new apiResponse(
				"Workspace created successfully.",
				workspace,
			),
		);
	},
);

export const updateWorkspace = asyncHandler(
	async (req: Request, res: Response) => {
		const workspace = await workspaceService.updateWorkspace(
			req.params.organizationSlug as string,
			req.params.workspaceSlug as string,
			req.user!.id,
			req.body,
		);

		return res.status(200).json(
			new apiResponse(
				"Workspace updated successfully.",
				workspace,
			),
		);
	},
);

export const archiveWorkspace = asyncHandler(
	async (req: Request, res: Response) => {
		const workspace = await workspaceService.archiveWorkspace(
			req.params.organizationSlug as string,
			req.params.workspaceSlug as string,
			req.user!.id,
		);

		return res.status(200).json(
			new apiResponse(
				"Workspace archived successfully.",
				workspace,
			),
		);
	},
);

export const fetchAllWorkspaces = asyncHandler(
	async (req: Request, res: Response) => {
		const workspaces =
			await workspaceService.fetchAllWorkspaces(
				req.params.organizationSlug as string,
				req.user!.id,
			);

		return res.status(200).json(
			new apiResponse(
				"Workspaces fetched successfully.",
				workspaces,
			),
		);
	},
);

export const fetchWorkspace = asyncHandler(
	async (req: Request, res: Response) => {
		const workspace =
			await workspaceService.fetchWorkspace(
				req.params.organizationSlug as string,
				req.params.workspaceSlug as string,
				req.user!.id,
			);

		return res.status(200).json(
			new apiResponse(
				"Workspace fetched successfully.",
				workspace,
			),
		);
	},
);


export const addWorkspaceMember = asyncHandler(
	async (req: Request, res: Response) => {
		const member =
			await workspaceService.addWorkspaceMember(
				req.params.organizationSlug as string,
				req.params.workspaceSlug as string,
				req.user!.id,
				req.body,
			);

		return res.status(201).json(
			new apiResponse(
				"Member added to workspace successfully.",
				member,
			),
		);
	},
);

export const fetchAllWorkspaceMembers = asyncHandler(
	async (req: Request, res: Response) => {
		const members =
			await workspaceService.fetchAllWorkspaceMembers(
				req.params.organizationSlug as string,
				req.params.workspaceSlug as string,
				req.user!.id,
			);

		return res.status(200).json(
			new apiResponse(
				"Workspace members fetched successfully.",
				members,
			),
		);
	},
);

export const fetchWorkspaceMember = asyncHandler(
	async (req: Request, res: Response) => {
		const member =
			await workspaceService.fetchWorkspaceMember(
				req.params.organizationSlug as string,
				req.params.workspaceSlug as string,
				req.user!.id,
				req.params.memberId as string,
			);

		return res.status(200).json(
			new apiResponse(
				"Workspace member fetched successfully.",
				member,
			),
		);
	},
);

export const updateWorkspaceMemberRole = asyncHandler(
	async (req: Request, res: Response) => {
		const member =
			await workspaceService.updateWorkspaceMemberRole(
				req.params.organizationSlug as string,
				req.params.workspaceSlug as string,
				req.user!.id,
				req.params.memberId as string,
				req.body.role,
			);

		return res.status(200).json(
			new apiResponse(
				"Workspace member role updated successfully.",
				member,
			),
		);
	},
);

export const removeWorkspaceMember = asyncHandler(
	async (req: Request, res: Response) => {
		const member =
			await workspaceService.removeWorkspaceMember(
				req.params.organizationSlug as string,
				req.params.workspaceSlug as string,
				req.user!.id,
				req.params.memberId as string,
			);

		return res.status(200).json(
			new apiResponse(
				"Workspace member removed successfully.",
				member,
			),
		);
	},
);
