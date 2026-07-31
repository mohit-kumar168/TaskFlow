import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import prisma from "../prisma/client";
import apiError from "../utils/apiError";
import apiResponse from "../utils/apiResponse";
import logger from "@/config/logger";

export const createProject = asyncHandler(async (req: Request, res: Response) => {
	const workspaceId = req.params.workspaceId as string;
	const { name, key, description } = req.body;

	const normalizeKey = key.trim().toUpperCase();

	if (!name || !key) {
		throw new apiError(400, "Name and key are required");
	}

	const membership = await prisma.workspaceMember.findFirst({
		where: {
			workspaceId,
			userId: req.user!.id,
			status: "active"
		}
	});

	if (!membership) {
		throw new apiError(404, "Workspace membership not found");
	}

	if (membership?.role !== "OWNER" && membership?.role !== "ADMIN") {
		throw new apiError(403, "Unauthorized");
	}


	const isProjectExist = await prisma.project.findUnique({
		where: {
			workspaceId_key: {
				workspaceId,
				key: normalizeKey
			}
		}
	});

	if (isProjectExist) {
		throw new apiError(400, "Project already exist");
	}

	const project = await prisma.project.create({
		data: {
			workspaceId,
			name,
			key: normalizeKey,
			description,
		}
	});

	await prisma.projectMember.create({
		data: {
			projectId: project.id,
			userId: req.user!.id,
			role: "ADMIN"
		}
	})

	return res.status(201).json(
		new apiResponse(
			"Project created successfully",
			project
		)
	);
});

export const fetchAllProjects = asyncHandler(async (req: Request, res: Response) => {
	const workspaceId = req.params.workspaceId as string;

	const projects = await prisma.project.findMany({
		where: {
			workspaceId,
			isArchived: false,
			members: {
				some: {
					userId: req.user?.id
				}
			}
		},
	});

	return res.status(200).json(
		new apiResponse(
			"Projects fetched successfully",
			projects
		)
	);
});

export const fetchProject = asyncHandler(async (req: Request, res: Response) => {
	const workspaceId = req.params.workspaceId as string;
	const projectId = req.params.projectId as string;

	const project = await prisma.project.findFirst({
		where: {
			workspaceId,
			id: projectId,
			members: {
				some: {
					userId: req.user!.id
				}
			}
		}
	});

	if (!project) {
		throw new apiError(404, "Project not found or you don't have access");
	}

	return res.status(200).json(
		new apiResponse(
			"Project fetched successfully",
			project
		)
	);
});

export const updateProject = asyncHandler(async (req: Request, res: Response) => {
	const workspaceId = req.params.workspaceId as string;
	const projectId = req.params.projectId as string;
	const { name, key, description } = req.body;

	if (!name || !key || !description) {
		throw new apiError(400, "All fields are required");
	}

	const normalizeKey = key.trim().toUpperCase();

	const existingProject = await prisma.project.findFirst({
		where: {
			workspaceId,
			key: normalizeKey,
			NOT: {
				id: projectId
			}
		}
	});

	if (existingProject) {
		throw new apiError(400, "Project with this key already exists");
	}

	const projectMembership = await prisma.project.findFirst({
		where: {
			workspaceId,
			id: projectId,
			members: {
				some: {
					userId: req.user!.id,
					role: "ADMIN"
				}
			}
		},

	});

	if (!projectMembership) {
		throw new apiError(404, "Project not found or you don't have access");
	}

	const project = await prisma.project.update({
		where: {
			id: projectId
		},
		data: {
			name,
			key: normalizeKey,
			description,
		}
	})

	return res.status(200).json(
		new apiResponse(
			"Project details updated successfully",
			project
		)
	)
});

export const removeProject = asyncHandler(async (req: Request, res: Response) => {
	const workspaceId = req.params.workspaceId as string;
	const projectId = req.params.projectId as string;

	const project = await prisma.project.findFirst({
		where: {
			workspaceId,
			id: projectId,
			isArchived: false,
			members: {
				some: {
					userId: req.user!.id,
					role: "ADMIN"
				}
			}
		}
	});

	if (!project) {
		throw new apiError(404, "Project not found or you don't have access");
	}

	const projectToDelete = await prisma.project.update({
		where: {
			id: projectId
		},
		data: {
			isArchived: true
		}
	})

	return res.status(200).json(
		new apiResponse(
			"Project removed successfully",
			projectToDelete
		)
	)
})
