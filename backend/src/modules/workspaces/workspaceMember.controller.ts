import type { Request, Response } from "express";
import asyncHandler from "@/utils/asyncHandler";
import prisma from "@/prisma/client";
import apiError from "@/utils/apiError";
import apiResponse from "@/utils/apiResponse";

export const addMember = asyncHandler(async (req: Request, res: Response) => {
	const workspaceId = req.params.workspaceId as string;
	const { email, role } = req.body;

	const newRole = role.trim().toUpperCase();
	if (!["OWNER", "ADMIN", "MEMBER"].includes(newRole)) {
		throw new apiError(400, "Invalid role");
	}
	const membership = await prisma.workspaceMember.findUnique({
		where: {
			workspaceId_userId: {
				workspaceId,
				userId: req.user!.id
			}
		},
	});

	if (membership?.role !== "OWNER" && membership?.role !== "ADMIN") {
		throw new apiError(403, "Unauthorized");
	}

	const user = await prisma.user.findUnique({
		where: {
			email
		}
	});

	if (!user) {
		throw new apiError(404, "User not found");
	}

	const isUserExistInWorkspace = await prisma.workspaceMember.findUnique({
		where: {
			workspaceId_userId: {
				workspaceId,
				userId: user.id
			}
		}
	});

	if (isUserExistInWorkspace) {
		throw new apiError(409, "User already exist in workspace");
	}


	const member = await prisma.workspaceMember.create({
		data: {
			workspaceId,
			userId: user.id,
			role,
		}
	});

	return res.status(201).json(
		new apiResponse(
			"Member created successfully",
			member
		)
	);
});

export const updateMemberRole = asyncHandler(async (req: Request, res: Response) => {
	const workspaceId = req.params.workspaceId as string;
	const memberId = req.params.memberId as string;
	const { role } = req.body;

	const membership = await prisma.workspaceMember.findFirst({
		where: {
			workspaceId,
			userId: req.user!.id,
			status: "active",
		},
	});

	if (membership?.role !== "OWNER") {
		throw new apiError(403, "Unauthorized");
	}

	const targetMember = await prisma.workspaceMember.findUnique({
		where: {
			workspaceId_userId: {
				workspaceId,
				userId: memberId
			}
		}
	})

	if (!targetMember || targetMember.status !== "active") {
		throw new apiError(404, "Member not found");
	}

	if (targetMember.role === "OWNER") {
		throw new apiError(400, "Owner role can't be changed");
	}

	const member = await prisma.workspaceMember.update({
		where: {
			id: targetMember.id
		},
		data: {
			role
		}
	});


	return res.status(200).json(
		new apiResponse(
			"Member role updated successfully",
			member
		)
	);
});

export const fetchAllMembers = asyncHandler(async (req: Request, res: Response) => {
	const workspaceId = req.params.workspaceId as string;

	const membership = await prisma.workspaceMember.findFirst({
		where: {
			workspaceId,
			userId: req.user!.id,
			status: "active"
		}
	});

	if (!membership) {
		throw new apiError(403, "Unauthorized");
	}

	const members = await prisma.workspaceMember.findMany({
		where: {
			workspaceId,
			status: "active"
		},
		include: {
			user: {
				select: {
					id: true,
					name: true,
					email: true,
				}
			}
		}
	});

	return res.status(200).json(
		new apiResponse(
			"Members fetched successfully",
			members
		)
	);
});

export const removeMember = asyncHandler(async (req: Request, res: Response) => {
	const workspaceId = req.params.workspaceId as string;
	const memberId = req.params.memberId as string;

	const membership = await prisma.workspaceMember.findFirst({
		where: {
			workspaceId,
			userId: req.user!.id,
			status: "active"
		}
	})

	if (membership?.role !== "OWNER" && membership?.role !== "ADMIN") {
		throw new apiError(403, "Unauthorized");
	}

	const targetMember = await prisma.workspaceMember.findFirst({
		where: {
			workspaceId,
			userId: memberId,
			status: "active"
		}
	})

	if (!targetMember) {
		throw new apiError(404, "Member not found");
	}
	if (targetMember.role === "OWNER") {
		throw new apiError(400, "Workspace owner can't be removed");
	}

	const removedMember = await prisma.workspaceMember.update({
		where: {
			workspaceId_userId: {
				workspaceId,
				userId: memberId
			}
		},
		data: {
			status: "inactive"
		}
	})

	return res.status(200).json(
		new apiResponse(
			"Removed member successfully from the workspace",
			removedMember
		)
	)
})
