import prisma from "@/prisma/client";
import type { CreateWorkspaceInput, UpdateWorkspaceInput } from "./workspace.types";
import { MembershipStatus, WorkspaceRole } from "@/generated/prisma/enums";

export const createWorkspace = async (organizationId: string, ownerId: string, workspaceSlug: string, data: CreateWorkspaceInput) => {
	return await prisma.$transaction(async (tx) => {
		const workspace = await tx.workspace.create({
			data: {
				organizationId,
				ownerId,
				slug: workspaceSlug,
				name: data.name,
				description: data.description,
				logoUrl: data.logoUrl,
			},
		});

		await tx.workspaceMember.create({
			data: {
				workspaceId: workspace.id,
				userId: ownerId,
				role: WorkspaceRole.OWNER,
			},
		});

		return workspace;
	});
};

export const findWorkspaceById = async (workspaceId: string) => {
	return await prisma.workspace.findUnique({
		where: {
			id: workspaceId,
		},
	});
};

export const findWorkspaceBySlug = async (organizationId: string, workspaceSlug: string, userId: string) => {
	return await prisma.workspace.findFirst({
		where: {
			organizationId,
			slug: workspaceSlug,
			isArchived: false,
			members: {
				some: {
					userId,
					status: MembershipStatus.ACTIVE,
				},
			},
		},
	});
};

export const updateWorkspace = async (workspaceId: string, data: UpdateWorkspaceInput) => {
	return await prisma.workspace.update({
		where: {
			id: workspaceId,
		},
		data: {
			name: data.name,
			description: data.description,
			logoUrl: data.logoUrl
		},
	});
};

export const archiveWorkspace = async (workspaceId: string) => {
	return await prisma.workspace.update({
		where: {
			id: workspaceId,
		},
		data: {
			isArchived: true,
		},
	});
};

export const fetchAllWorkspaces = async (organizationId: string) => {
	return await prisma.workspace.findMany({
		where: {
			organizationId,
		},
	});
};

export const fetchWorkspace = async (organizationId: string, workspaceSlug: string, userId: string) => {
	return await prisma.workspace.findFirst({
		where: {
			organizationId,
			slug: workspaceSlug,
			isArchived: false,
			members: {
				some: {
					userId,
					status: MembershipStatus.ACTIVE,
				},
			},
		},
		include: {
			members: {
				include: {
					user: {
						select: {
							id: true,
							name: true,
							email: true,
							avatarUrl: true,
						},
					},
				},
			},
		},
	});
};

export const createWorkspaceMember = async (workspaceId: string, userId: string, role: WorkspaceRole) => {
	return await prisma.workspaceMember.create({
		data: {
			workspaceId,
			userId,
			role,
		},
	});
};

export const fetchAllWorkspaceMembers = async (workspaceId: string) => {
	return await prisma.workspaceMember.findMany({
		where: {
			workspaceId,
			status: MembershipStatus.ACTIVE,
		},
		include: {
			user: {
				select: {
					id: true,
					name: true,
					email: true,
					avatarUrl: true,
				},
			},
		},
	});
};

export const fetchWorkspaceMemberById = async (workspaceId: string, memberId: string) => {
	return await prisma.workspaceMember.findFirst({
		where: {
			id: memberId,
			workspaceId,
			status: MembershipStatus.ACTIVE,
		},
		include: {
			user: {
				select: {
					id: true,
					name: true,
					email: true,
					avatarUrl: true,
				},
			},
		},
	});
};

export const fetchWorkspaceMemberByUserId = async (workspaceId: string, userId: string) => {
	return await prisma.workspaceMember.findFirst({
		where: {
			workspaceId,
			userId,
		},
	});
};

export const updateWorkspaceMemberRole = async (memberId: string, role: WorkspaceRole) => {
	return await prisma.workspaceMember.update({
		where: {
			id: memberId,
		},
		data: {
			role,
		},
	});
};

export const removeWorkspaceMember = async (memberId: string) => {
	return await prisma.workspaceMember.update({
		where: {
			id: memberId,
		},
		data: {
			status: MembershipStatus.REMOVED,
		},
	});
};
