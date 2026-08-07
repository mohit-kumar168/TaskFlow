import type { Request, Response } from "express"
import asyncHandler from "@/utils/asyncHandler"
import prisma from "@/prisma/client"
import apiError from "@/utils/apiError";
import apiResponse from "@/utils/apiResponse";

export const createWorkspace = asyncHandler(async (req: Request, res: Response) => {
	const { name, description } = req.body;
	const slug = name.trim().toLowerCase().replace(/\s+/g, "-");

	const isWorkspaceExist = await prisma.workspace.findUnique({
		where: {
			slug
		}
	})

	if (isWorkspaceExist) {
		throw new apiError(400, "Workspace already exists");
	}

	const result = await prisma.$transaction(async (tx) => {
		const workspace = await tx.workspace.create({
			data: {
				name,
				description,
				slug,
				ownerId: req.user!.id
			}
		})

		await tx.workspaceMember.create({
			data: {
				workspaceId: workspace.id,
				userId: req.user!.id,
				role: "OWNER",
				status: "active"
			}
		})
		return workspace;
	})

	return res.status(201).json(
		new apiResponse(
			"Workspace created successfully",
			{
				workspace: result
			}
		)
	);
});

export const fetchAllWorkspaces = asyncHandler(async (req: Request, res: Response) => {
	const workspaces = await prisma.workspaceMember.findMany({
		where: {
			userId: req.user!.id,
			workspace: {
				isArchived: false
			}
		},
		include: {
			workspace: {
				include: {
					_count: {
						select: {
							members: true,
							projects: true
						}
					}
				}
			}

		}
	});

	if (!workspaces) {
		throw new apiError(404, "Workspaces not found");
	}

	return res.status(200).json(
		new apiResponse(
			"Workspaces fetched successfully",
			workspaces
		)
	);
});

export const fetchWorkspace = asyncHandler(async (req: Request, res: Response) => {
	const workspaceId = req.params.workspaceId as string;

	const workspace = await prisma.workspaceMember.findFirst({
		where: {
			workspaceId,
			userId: req.user!.id,
			status: "active",
			workspace: {
				isArchived: false
			}
		},
		include: {
			workspace: {
				include: {
					_count: {
						select: {
							members: true,
							projects: true
						}
					}
				}
			}
		}
	});

	if (!workspace) {
		throw new apiError(404, "Workspace not found");
	}

	return res.status(200).json(
		new apiResponse(
			"Workspace fetched successfully",
			workspace
		)
	);
});

export const deleteWorkspace = asyncHandler(async (req: Request, res: Response) => {
	const workspaceId = req.params.workspaceId as string;

	const membership = await prisma.workspaceMember.findUnique({
		where: {
			workspaceId_userId: {
				workspaceId,
				userId: req.user!.id
			}
		},
	});
	if (!membership) {
		throw new apiError(404, "Workspace not found");
	}

	if (membership.role !== "OWNER") {
		throw new apiError(403, "Only owner can delete the workspace");
	}

	const workspace = await prisma.workspace.update({
		where: {
			id: workspaceId
		},
		data: {
			isArchived: true
		}
	})

	if (!workspace) {
		throw new apiError(404, "Workspace not found");
	}

	await prisma.workspaceMember.update({
		where: {
			workspaceId_userId: {
				workspaceId,
				userId: req.user!.id
			}
		},
		data: {
			status: "inactive"
		}
	})

	return res.status(200).json(
		new apiResponse(
			"Workspace deleted successfully",
			workspace
		)
	);
});
