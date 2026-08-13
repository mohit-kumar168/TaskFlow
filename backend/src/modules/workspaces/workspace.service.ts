import apiError from "@/utils/apiError";
import {
	MembershipStatus,
	OrganizationRole,
	WorkspaceRole,
} from "@/generated/prisma/enums";

import type {
	CreateWorkspaceInput,
	UpdateWorkspaceInput,
	AddWorkspaceMemberInput,
} from "./workspace.types";

import { createSlug } from "@/utils/slug";

import * as workspaceRepository from "./workspace.repository";
import * as organizationRepository from "@/modules/organization/organization.repository";
import * as authRepository from "@/modules/auth/auth.repository";


export const createWorkspace = async (organizationSlug: string, ownerId: string, data: CreateWorkspaceInput) => {
	const organization = await organizationRepository.findOrganizationBySlug(organizationSlug, ownerId);

	if (!organization) {
		throw new apiError(404, "Organization not found.");
	}

	const organizationMember = await organizationRepository.fetchOrganizationMemberByUserId(organization.id, ownerId);

	if (!organizationMember || organizationMember.status !== MembershipStatus.ACTIVE) {
		throw new apiError(403, "You are not a member of this organization.");
	}

	if (organizationMember.role !== OrganizationRole.OWNER && organizationMember.role !== OrganizationRole.ADMIN) {
		throw new apiError(403, "You don't have permission to create a workspace.");
	}

	const slug = createSlug(data.name);

	return workspaceRepository.createWorkspace(organization.id, ownerId, slug, data);
};

export const updateWorkspace = async (organizationSlug: string, workspaceSlug: string, userId: string, data: UpdateWorkspaceInput) => {
	const organization = await organizationRepository.findOrganizationBySlug(organizationSlug, userId);

	if (!organization) {
		throw new apiError(404, "Organization not found.");
	}
	const workspace = await workspaceRepository.findWorkspaceBySlug(organization.id, workspaceSlug, userId);

	if (!workspace) {
		throw new apiError(404, "Workspace not found.");
	}

	const member = await workspaceRepository.fetchWorkspaceMemberByUserId(workspace.id, userId);

	if (!member || member.status !== MembershipStatus.ACTIVE) {
		throw new apiError(403, "You don't have access to this workspace.");
	}

	if (member.role !== WorkspaceRole.OWNER && member.role !== WorkspaceRole.ADMIN) {
		throw new apiError(403, "You don't have permission to update this workspace.");
	}

	return await workspaceRepository.updateWorkspace(workspace.id, data);
};


export const archiveWorkspace = async (organizationSlug: string, workspaceSlug: string, userId: string) => {
	const organization = await organizationRepository.findOrganizationBySlug(organizationSlug, userId);

	if (!organization) {
		throw new apiError(404, "Organization not found.");
	}

	const workspace = await workspaceRepository.findWorkspaceBySlug(organization.id, workspaceSlug, userId);

	if (!workspace) {
		throw new apiError(404, "Workspace not found.");
	}

	const member = await workspaceRepository.fetchWorkspaceMemberByUserId(workspace.id, userId);

	if (!member || member.role !== WorkspaceRole.OWNER) {
		throw new apiError(403, "Only workspace owner can archive this workspace.");
	}

	return await workspaceRepository.archiveWorkspace(workspace.id);
};


export const fetchAllWorkspaces = async (organizationSlug: string, userId: string) => {
	const organization = await organizationRepository.findOrganizationBySlug(organizationSlug, userId);

	if (!organization) {
		throw new apiError(404, "Organization not found.");
	}

	const organizationMember = await organizationRepository.fetchOrganizationMemberByUserId(organization.id, userId);

	if (!organizationMember || organizationMember.status !== MembershipStatus.ACTIVE) {
		throw new apiError(403, "You don't have access to this organization.");
	}

	return await workspaceRepository.fetchAllWorkspaces(organization.id);
};


export const fetchWorkspace = async (organizationSlug: string, slug: string, userId: string) => {
	const organization = await organizationRepository.findOrganizationBySlug(organizationSlug, userId);

	if (!organization) {
		throw new apiError(404, "Organization not found.");
	}

	const workspace = await workspaceRepository.findWorkspaceBySlug(organization.id, slug, userId);

	if (!workspace) {
		throw new apiError(404, "Workspace not found or you don't have access to it.");
	}

	return workspace;
};


export const addWorkspaceMember = async (organizationSlug: string, workspaceSlug: string, requesterId: string, data: AddWorkspaceMemberInput) => {

	const organization = await organizationRepository.findOrganizationBySlug(organizationSlug, requesterId);

	if (!organization) {
		throw new apiError(404, "Organization not found.");
	}

	const organizationMember = await organizationRepository.fetchOrganizationMemberByUserId(organization.id, requesterId);

	if (!organizationMember || organizationMember.status !== MembershipStatus.ACTIVE) {
		throw new apiError(403, "You don't have access to this organization.");
	}

	if (organizationMember.role !== OrganizationRole.OWNER && organizationMember.role !== OrganizationRole.ADMIN) {
		throw new apiError(403, "You don't have permission to add workspace members.");
	}

	const workspace = await workspaceRepository.findWorkspaceBySlug(organization.id, workspaceSlug, requesterId);

	if (!workspace) {
		throw new apiError(404, "Workspace not found.");
	}

	const user = await authRepository.findUserByEmail(data.email);

	if (!user) {
		throw new apiError(404, "User not found.");
	}

	const targetOrganizationMember = await organizationRepository.fetchOrganizationMemberByUserId(organization.id, user.id);

	if (!targetOrganizationMember || targetOrganizationMember.status !== MembershipStatus.ACTIVE) {
		throw new apiError(400, "User is not a member of this organization.");
	}

	const existingMember = await workspaceRepository.fetchWorkspaceMemberByUserId(workspace.id, user.id);

	if (existingMember?.status === MembershipStatus.ACTIVE) {
		throw new apiError(409, "User is already a member of this workspace.");
	}

	return await workspaceRepository.createWorkspaceMember(workspace.id, user.id, data.role ?? WorkspaceRole.MEMBER);
};


export const fetchAllWorkspaceMembers = async (organizationSlug: string, workspaceSlug: string, userId: string) => {

	const organization = await organizationRepository.findOrganizationBySlug(organizationSlug, userId);

	if (!organization) {
		throw new apiError(404, "Organization not found.");
	}
	const workspace = await workspaceRepository.findWorkspaceBySlug(organization.id, workspaceSlug, userId);

	if (!workspace) {
		throw new apiError(404, "Workspace not found.");
	}

	return await workspaceRepository.fetchAllWorkspaceMembers(workspace.id);
};


export const fetchWorkspaceMember = async (organizationSlug: string, workspaceSlug: string, userId: string, memberId: string) => {

	const organization = await organizationRepository.findOrganizationBySlug(organizationSlug, userId);

	if (!organization) {
		throw new apiError(404, "Organization not found.");
	}
	const workspace = await workspaceRepository.findWorkspaceBySlug(organization.id, workspaceSlug, userId);

	if (!workspace) {
		throw new apiError(404, "Workspace not found.");
	}

	const member = await workspaceRepository.fetchWorkspaceMemberById(workspace.id, memberId);

	if (!member) {
		throw new apiError(404, "Workspace member not found.");
	}

	return member;
};


export const updateWorkspaceMemberRole = async (organizationSlug: string, workspaceSlug: string, requesterId: string, memberId: string, role: WorkspaceRole) => {

	const organization = await organizationRepository.findOrganizationBySlug(organizationSlug, requesterId);

	if (!organization) {
		throw new apiError(404, "Organization not found.");
	}
	const workspace = await workspaceRepository.findWorkspaceBySlug(organization.id, workspaceSlug, requesterId);

	if (!workspace) {
		throw new apiError(404, "Workspace not found.");
	}

	const requester = await workspaceRepository.fetchWorkspaceMemberByUserId(workspace.id, requesterId);

	if (!requester) {
		throw new apiError(403, "You don't have access to this workspace.");
	}

	if (requester.role !== WorkspaceRole.OWNER && requester.role !== WorkspaceRole.ADMIN) {
		throw new apiError(403, "You don't have permission to update member roles.");
	}

	const target = await workspaceRepository.fetchWorkspaceMemberById(workspace.id, memberId);

	if (!target) {
		throw new apiError(404, "Workspace member not found.");
	}

	if (target.role === WorkspaceRole.OWNER) {
		throw new apiError(403, "Workspace owner role cannot be changed.");
	}

	if (requester.role === WorkspaceRole.ADMIN && target.role === WorkspaceRole.ADMIN) {
		throw new apiError(403, "Admin cannot change another admin's role.");
	}

	if (role === WorkspaceRole.OWNER) {
		throw new apiError(403, "Owner role cannot be assigned.");
	}

	return await workspaceRepository.updateWorkspaceMemberRole(target.id, role);
};


export const removeWorkspaceMember = async (organizationSlug: string, workspaceSlug: string, requesterId: string, memberId: string) => {

	const organization = await organizationRepository.findOrganizationBySlug(organizationSlug, requesterId);

	if (!organization) {
		throw new apiError(404, "Organization not found.");
	}
	const workspace = await workspaceRepository.findWorkspaceBySlug(organization.id, workspaceSlug, requesterId);

	if (!workspace) {
		throw new apiError(404, "Workspace not found.");
	}

	const requester = await workspaceRepository.fetchWorkspaceMemberByUserId(workspace.id, requesterId);

	if (!requester) {
		throw new apiError(403, "You don't have access to this workspace.");
	}

	if (requester.role !== WorkspaceRole.OWNER && requester.role !== WorkspaceRole.ADMIN) {
		throw new apiError(403, "You don't have permission to remove members.");
	}

	const target = await workspaceRepository.fetchWorkspaceMemberById(workspace.id, memberId);

	if (!target) {
		throw new apiError(404, "Workspace member not found.");
	}

	if (target.role === WorkspaceRole.OWNER) {
		throw new apiError(403, "Workspace owner cannot be removed.");
	}

	if (requester.role === WorkspaceRole.ADMIN && target.role === WorkspaceRole.ADMIN) {
		throw new apiError(403, "Admin cannot remove another admin.");
	}

	return await workspaceRepository.removeWorkspaceMember(target.id);
};
