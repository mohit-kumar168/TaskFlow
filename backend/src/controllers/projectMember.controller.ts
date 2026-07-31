import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import prisma from "../prisma/client";
import apiError from "../utils/apiError";
import apiResponse from "../utils/apiResponse";

export const addMember = asyncHandler(async (req: Request, res: Response) => {
	const projectId = req.params.projectId as string;
	const { email, role } = req.body;

	const newRole = role.trim().toUpperCase();

	if (!["ADMIN", "MEMBER"].includes(newRole)) {
		throw new apiError(400, "Invalid role");
	}

	const project = await prisma.project.findUnique({
		where: {
			id: projectId
		},
		select: {
			workspaceId: true
		}
	});

	if (!project) {
		throw new apiError(404, "Project not found");
	}

	const projectAdmin = await prisma.projectMember.findFirst({
		where: {
			projectId,
			userId: req.user?.id,
			role: "ADMIN"
		},
	});

	if (!projectAdmin) {
		throw new apiError(404, "Project not found or you don't have access");
	}

	const user = await prisma.user.findUnique({
		where: {
			email
		}
	});

	if (!user) {
		throw new apiError(404, "User not found");
	}

	const targetWorkspaceMember = await prisma.workspaceMember.findFirst({
		where: {
			workspaceId: project.workspaceId,
			userId: user.id,
			status: "active"
		}
	});

	if (!targetWorkspaceMember) {
		throw new apiError(403, "User must be a memebr of this workspace before joining the project");
	}


	const existingMember = await prisma.projectMember.findUnique({
		where: {
			projectId_userId: {
				projectId,
				userId: user.id
			}
		}
	});

	if (existingMember) {
		throw new apiError(400, "User is already a member");
	}

	const addedProjectMember = await prisma.projectMember.create({
		data: {
			projectId,
			userId: user.id,
			role: newRole,
		}
	});

	return res.status(201).json(
		new apiResponse(
			"Member added to project successfully",
			addedProjectMember
		)
	)
});

export const fetchAllProjectMembers = asyncHandler(async (req: Request, res: Response) => {
	const workspaceId = req.params.workspaceId as string;
	const projectId = req.params.projectId as string;

	const projectMember = await prisma.projectMember.findFirst({
		where: {
			projectId,
			userId: req.user!.id,
		},
	});

	if (!projectMember) {
		throw new apiError(404, "Project not found");
	}

	const members = await prisma.projectMember.findMany({
		where: {
			projectId
		},
		include: {
			user: {
				select: {
					id: true,
					name: true,
					email: true,
				}
			}
		},
		orderBy: {
			joinedAt: "desc"
		}
	});

	return res.status(200).json(
		new apiResponse(
			"All members fetched successfully",
			members
		)
	);
});

export const fetchProjectMember = asyncHandler(async (req: Request, res: Response) => {
	const projectId = req.params.projectId as string;
	const memberId = req.params.memberId as string;

	const projectMember = await prisma.projectMember.findFirst({
		where: {
			projectId,
			userId: req.user!.id,
		},
	});

	if (!projectMember) {
		throw new apiError(404, "Project not found or you don't have access");
	}

	const member = await prisma.projectMember.findUnique({
		where: {
			id: memberId,
		},
		include: {
			user: {
				select: {
					id: true,
					name: true,
					email: true,
				},
			},
		},
	});

	if (!member || member.projectId !== projectId) {
		throw new apiError(404, "Member not found");
	}

	return res.status(200).json(
		new apiResponse(
			"Project member fetched successfully",
			member
		)
	);
});

export const updateProjectMember = asyncHandler(async (req: Request, res: Response) => {
	const projectId = req.params.projectId as string;
	const memberId = req.params.memberId as string;
	const { role } = req.body;

	const newRole = role.trim().toUpperCase();

	if (!["ADMIN", "MEMBER"].includes(newRole)) {
		throw new apiError(400, "Invalid role");
	}

	const projectAdmin = await prisma.projectMember.findFirst({
		where: {
			projectId,
			userId: req.user!.id,
			role: "ADMIN",
		},
	});

	if (!projectAdmin) {
		throw new apiError(403, "Unauthorized");
	}

	const member = await prisma.projectMember.findUnique({
		where: {
			id: memberId,
		},
	});

	if (!member || member.projectId !== projectId) {
		throw new apiError(404, "Member not found");
	}

	if (member.userId === req.user!.id && member.role === "ADMIN" && newRole === "MEMBER") {
		throw new apiError(400, "You cannot remove your own admin privileges");
	}

	const updatedMember = await prisma.projectMember.update({
		where: {
			id: memberId,
		},
		data: {
			role: newRole,
		},
	});

	return res.status(200).json(
		new apiResponse(
			"Project member updated successfully",
			updatedMember
		)
	);
});

export const removeProjectMember = asyncHandler(async (req: Request, res: Response) => {
	const projectId = req.params.projectId as string;
	const memberId = req.params.memberId as string;

	const projectAdmin = await prisma.projectMember.findFirst({
		where: {
			projectId,
			userId: req.user!.id,
			role: "ADMIN",
		},
	});

	if (!projectAdmin) {
		throw new apiError(403, "Unauthorized");
	}

	const member = await prisma.projectMember.findUnique({
		where: {
			id: memberId,
		},
	});

	if (!member || member.projectId !== projectId) {
		throw new apiError(404, "Member not found");
	}

	// Prevent removing the last admin
	if (member.role === "ADMIN") {
		const adminCount = await prisma.projectMember.count({
			where: {
				projectId,
				role: "ADMIN",
			},
		});

		if (adminCount === 1) {
			throw new apiError(
				400,
				"Cannot remove the last project admin"
			);
		}
	}

	await prisma.projectMember.delete({
		where: {
			id: memberId,
		},
	});

	return res.status(200).json(
		new apiResponse(
			"Project member removed successfully",
			null
		)
	);
});
