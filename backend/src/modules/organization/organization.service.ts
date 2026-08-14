import apiError from "@/utils/apiError";
import type { CreateOrganizationInput, CreateOrganizationInviteInput, UpdateOrganizationInput } from "./organization.types";
import { generateSlug } from "@/utils/slug";
import * as organizationRepository from "./organization.repository";
import { OrganizationRole } from "@/generated/prisma/enums";
import { generateInviteToken } from "@/utils/token";

export const createOrganization = async (ownerId: string, data: CreateOrganizationInput) => {
	const slug = generateSlug(data.name);

	return await organizationRepository.createOrganization(ownerId, slug, data);
};

export const updateOrganization = async (slug: string, userId: string, data: UpdateOrganizationInput) => {
	const organization = await organizationRepository.findOrganizationBySlug(slug, userId);
	if (!organization) {
		throw new apiError(404, "Organization not found.");
	}

	if (organization.ownerId !== userId) {
		throw new apiError(403, "You don't have permission to update this organization.");
	}

	return await organizationRepository.updateOrganization(organization.id, data);
};

export const archiveOrganization = async (slug: string, userId: string) => {
	const organization = await organizationRepository.findOrganizationBySlug(slug, userId);
	if (!organization) {
		throw new apiError(404, "Organization not found.");
	}

	if (organization.ownerId !== userId) {
		throw new apiError(403, "You don't have permission to archive this organization.");
	}

	return await organizationRepository.archiveOrganization(organization.id);
};

export const fetchAllOrganizations = async (userId: string) => {
	return await organizationRepository.fetchAllOrganizations(userId);
};

export const fetchOrganization = async (slug: string, userId: string) => {
	const organization = await organizationRepository.findOrganizationBySlug(slug, userId);

	if (!organization) {
		throw new apiError(404, "Organization not found or you don't have access to it.")
	}

	return organization;
};

export const inviteMember = async (slug: string, userId: string, data: CreateOrganizationInviteInput) => {
	const organization = await organizationRepository.findOrganizationBySlug(slug, userId);
	if (!organization) {
		throw new apiError(404, "Organization not found.");
	}
	const requester = organization.members.find((member) => member.userId === userId);
	if (!requester || (requester.role !== OrganizationRole.OWNER && requester.role !== OrganizationRole.ADMIN)) {
		throw new apiError(403, "You don't have permission to invite members.");
	}

	const existingMember = await organizationRepository.findOrganizationMember(organization.id, data.email);
	if (existingMember) {
		throw new apiError(409, "User is already a member of this organization.");
	}

	const existingInvite = await organizationRepository.findOrganizationInvite(organization.id, data.email);
	if (existingInvite) {
		throw new apiError(409, "An invitition has already been sent to this email.");
	}

	const token = generateInviteToken();
	const expiresAt = new Date(
		Date.now() + 7 * 24 * 60 * 60 * 1000,
	);
	const invite = await organizationRepository.createOrganizationInvite(organization.id, data.email, data.role ?? OrganizationRole.MEMBER, token, expiresAt);

	const inviteUrl = `http://localhost:3000/invitations/${token}`;

	return {
		id: invite.id,
		email: invite.email,
		role: invite.role,
		expiresAt: invite.expiresAt,
		inviteUrl
	};
};

export const acceptInvite = async (token: string, userId: string, userEmail: string) => {
	const invite = await organizationRepository.findOrganizationInviteByToken(token);
	if (!invite) {
		throw new apiError(404, "Invitation not found.");
	}

	if (invite.expiresAt < new Date()) {
		throw new apiError(410, "Invitation has expired.");
	}

	if (invite.email !== userEmail) {
		throw new apiError(403, "This invitation was sent to a different email address.");
	}

	const existingMember = await organizationRepository.findOrganizationMember(invite.organizationId, userEmail);

	if (existingMember) {
		throw new apiError(401, "User is already a member of this organization.");
	}

	return await organizationRepository.acceptOrganizationInvite(invite.id, invite.organizationId, userId, invite.role);
};

export const fetchAllOrganizationMembers = async (slug: string, userId: string) => {
	const organization = await organizationRepository.findOrganizationBySlug(slug, userId);
	if (!organization) {
		throw new apiError(404, "Organization not found.");
	}

	return await organizationRepository.fetchAllOrganizationMembers(organization.id);
};

export const fetchOrganizationMember = async (slug: string, userId: string, memberId: string) => {
	const organization = await organizationRepository.findOrganizationBySlug(slug, userId);
	if (!organization) {
		throw new apiError(404, "Organization not found.");
	}

	const member = await organizationRepository.fetchOrganizationMemberById(organization.id, memberId);
	if (!member) {
		throw new apiError(404, "Member not found.");
	}

	return member;
};

export const updateOrganizationMemberRole = async (slug: string, requesterId: string, memberId: string, role: OrganizationRole) => {
	const organization = await organizationRepository.findOrganizationBySlug(slug, requesterId);
	if (!organization) {
		throw new apiError(404, "Organization not found.");
	}
	const requester = await organizationRepository.fetchOrganizationMemberByUserId(organization.id, requesterId);

	if (!requester) {
		throw new apiError(404, "Requester not found.");
	}

	if (requester.role !== OrganizationRole.OWNER && requester.role !== OrganizationRole.ADMIN) {
		throw new apiError(403, "You don't have permission to update member role");
	}

	const targetMember = await organizationRepository.fetchOrganizationMemberById(organization.id, memberId);
	if (!targetMember) {
		throw new apiError(404, "Organization member not found.");
	}

	if (targetMember.role === OrganizationRole.OWNER) {
		throw new apiError(403, "Owner role can't be changed.");
	}

	if (requester.role === OrganizationRole.ADMIN && targetMember.role === OrganizationRole.ADMIN) {
		throw new apiError(403, "Admin can't change other admin role.");
	}

	if (role === OrganizationRole.OWNER) {
		throw new apiError(403, "Owner role can't be changed.");
	}

	return await organizationRepository.updateOrganizationMemberRole(targetMember.id, role);
};

export const removeOrganizationMember = async (slug: string, userId: string, memberId: string) => {
	const organization = await organizationRepository.findOrganizationBySlug(slug, userId);
	if (!organization) {
		throw new apiError(404, "Organization not found.");
	}

	const requester = await organizationRepository.fetchOrganizationMemberByUserId(organization.id, userId);
	if (!requester) {
		throw new apiError(404, "Member not found.");
	}

	if (requester.role !== OrganizationRole.OWNER && requester.role !== OrganizationRole.ADMIN) {
		throw new apiError(403, "You don't have permission to remove member.");
	}

	const targetMember = await organizationRepository.fetchOrganizationMemberById(organization.id, memberId);

	if (!targetMember) {
		throw new apiError(404, "User is not a member of this organization.");
	}

	if (targetMember.role === OrganizationRole.OWNER) {
		throw new apiError(403, "Owner role can't be changed.");
	}

	if (requester.role === OrganizationRole.ADMIN && targetMember.role === OrganizationRole.ADMIN) {
		throw new apiError(403, "Admin can't change other admin role.");
	}

	return await organizationRepository.removeOrganizationMember(targetMember.id);
};
