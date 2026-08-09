import prisma from "@/prisma/client";
import type { CreateOrganizationInput, UpdateOrganizationInput } from "./organization.types";
import { MembershipStatus, OrganizationRole } from "@/generated/prisma/enums";

export const createOrganization = async (ownerId: string, slug: string, data: CreateOrganizationInput) => {
	return await prisma.$transaction(async (tx) => {
		const organization = await tx.organization.create({
			data: {
				ownerId,
				name: data.name,
				slug,
				description: data.description,
				logoUrl: data.logoUrl,
			},
		});

		await tx.organizationMember.create({
			data: {
				organizationId: organization.id,
				userId: ownerId,
				role: OrganizationRole.OWNER,
			},
		});

		return organization;
	});
};

export const findOrganizationById = async (organizationId: string) => {
	return await prisma.organization.findUnique({
		where: {
			id: organizationId,
		},
	});
};

export const findOrganizationBySlug = async (slug: string, userId: string) => {
	return await prisma.organization.findFirst({
		where: {
			slug,
			isArchived: false,
			members: {
				some: {
					userId,
					status: MembershipStatus.ACTIVE,
				},
			},
		},
		include: {
			members: true,
		},
	});
};

export const updateOrganization = async (organizationId: string, data: UpdateOrganizationInput) => {
	return await prisma.organization.update({
		where: {
			id: organizationId,
		},
		data: {
			name: data.name,
			description: data.description,
			logoUrl: data.logoUrl,
		},
	});
};

export const archiveOrganization = async (organizationId: string) => {
	return await prisma.organization.update({
		where: {
			id: organizationId,
		},
		data: {
			isArchived: true,
		},
	});
};

export const fetchAllOrganizations = async (userId: string) => {
	return await prisma.organization.findMany({
		where: {
			isArchived: false,
			members: {
				some: {
					userId,
				},
			},
		},
	});
};

export const findOrganizationMember = async (organizationId: string, email: string) => {
	return await prisma.organizationMember.findFirst({
		where: {
			organizationId,
			user: {
				email,
			},
		},
	});
};

export const createOrganizationInvite = async (organizationId: string, email: string, role: OrganizationRole, token: string, expiresAt: Date) => {
	return await prisma.organizationInvite.create({
		data: {
			organizationId,
			email,
			role,
			token,
			expiresAt,
		},
	});
};

export const findOrganizationAllInvite = async (organizationId: string) => {
	return await prisma.organizationInvite.findMany({
		where: {
			organizationId,
		},
	})
};

export const findOrganizationInvite = async (organizationId: string, email: string) => {
	return await prisma.organizationInvite.findUnique({
		where: {
			organizationId_email: {
				organizationId,
				email,
			},
		},
	});
};

export const findOrganizationInviteByToken = async (token: string) => {
	return await prisma.organizationInvite.findUnique({
		where: {
			token,
		},
	});
};

export const acceptOrganizationInvite = async (inviteId: string, organizationId: string, userId: string, role: OrganizationRole) => {
	return await prisma.$transaction(async (tx) => {
		const member = await tx.organizationMember.create({
			data: {
				organizationId,
				userId,
				role,
			},
		});

		await tx.organizationInvite.delete({
			where: {
				id: inviteId,
			},
		});

		return member;
	});
};

export const cancelOrganizationInvite = async (inviteId: string) => {
	return await prisma.organizationInvite.delete({
		where: {
			id: inviteId,
		},
	});
};

export const fetchAllOrganizationMembers = async (organizationId: string) => {
	return await prisma.organizationMember.findMany({
		where: {
			organizationId,
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

export const fetchOrganizationMemberById = async (organizationId: string, memberId: string) => {
	return await prisma.organizationMember.findFirst({
		where: {
			id: memberId,
			organizationId,
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

export const fetchOrganizationMemberByUserId = async (organizationId: string, userId: string) => {
	return await prisma.organizationMember.findUnique({
		where: {
			organizationId_userId: {
				organizationId,
				userId,
			},
		},
	});
};

export const updateOrganizationMemberRole = async (memberId: string, role: OrganizationRole) => {
	return await prisma.organizationMember.update({
		where: {
			id: memberId,
		},
		data: {
			role,
		},
	});
};

export const removeOrganizationMember = async (memberId: string) => {
	return await prisma.organizationMember.update({
		where: {
			id: memberId,
		},
		data: {
			status: MembershipStatus.REMOVED,
		},
	});
};
