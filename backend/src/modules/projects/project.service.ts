import apiError from "@/utils/apiError";
import {
	MembershipStatus,
	ProjectRole,
	WorkspaceRole,
} from "@/generated/prisma/enums";
import { createSlug } from "@/utils/slug";

import type {
	CreateProjectInput,
	UpdateProjectInput,
	AddProjectMemberInput,
	CreateColumnInput,
	UpdateColumnInput,
} from "./project.types";

import * as projectRepository from "./project.repository";
import * as workspaceRepository from "@/modules/workspaces/workspace.repository";
import * as organizationRepository from "@/modules/organization/organization.repository";
import * as authRepository from "@/modules/auth/auth.repository";

export const createProject = async (
	organizationSlug: string,
	workspaceSlug: string,
	userId: string,
	data: CreateProjectInput,
) => {
	const organization = await organizationRepository.findOrganizationBySlug(
		organizationSlug,
		userId,
	);

	if (!organization) {
		throw new apiError(404, "Organization not found.");
	}

	const workspace = await workspaceRepository.findWorkspaceBySlug(
		organization.id,
		workspaceSlug,
		userId,
	);

	if (!workspace) {
		throw new apiError(404, "Workspace not found.");
	}

	const member = await workspaceRepository.fetchWorkspaceMemberByUserId(
		workspace.id,
		userId,
	);

	if (!member || member.status !== MembershipStatus.ACTIVE) {
		throw new apiError(403, "You don't have access to this workspace.");
	}

	if (
		member.role !== WorkspaceRole.OWNER &&
		member.role !== WorkspaceRole.ADMIN
	) {
		throw new apiError(403, "You don't have permission to create projects.");
	}

	const slug = createSlug(data.name);
	const key = data.key.trim().toUpperCase();

	return await projectRepository.createProject(
		workspace.id,
		userId,
		slug,
		key,
		data,
	);
};

export const fetchAllProjects = async (
	organizationSlug: string,
	workspaceSlug: string,
	userId: string,
) => {
	const organization = await organizationRepository.findOrganizationBySlug(
		organizationSlug,
		userId,
	);

	if (!organization) {
		throw new apiError(404, "Organization not found.");
	}

	const workspace = await workspaceRepository.findWorkspaceBySlug(
		organization.id,
		workspaceSlug,
		userId,
	);

	if (!workspace) {
		throw new apiError(404, "Workspace not found.");
	}

	return await projectRepository.fetchAllProjects(workspace.id);
};

export const fetchProject = async (
	organizationSlug: string,
	workspaceSlug: string,
	projectSlug: string,
	userId: string,
) => {
	const organization = await organizationRepository.findOrganizationBySlug(
		organizationSlug,
		userId,
	);

	if (!organization) {
		throw new apiError(404, "Organization not found.");
	}

	const workspace = await workspaceRepository.findWorkspaceBySlug(
		organization.id,
		workspaceSlug,
		userId,
	);

	if (!workspace) {
		throw new apiError(404, "Workspace not found.");
	}

	const project = await projectRepository.findProjectBySlug(
		workspace.id,
		userId,
		projectSlug,
	);

	if (!project) {
		throw new apiError(404, "Project not found.");
	}

	return project;
};

export const updateProject = async (
	organizationSlug: string,
	workspaceSlug: string,
	projectSlug: string,
	userId: string,
	data: UpdateProjectInput,
) => {
	const organization = await organizationRepository.findOrganizationBySlug(
		organizationSlug,
		userId,
	);

	if (!organization) {
		throw new apiError(404, "Organization not found.");
	}

	const workspace = await workspaceRepository.findWorkspaceBySlug(
		organization.id,
		workspaceSlug,
		userId,
	);

	if (!workspace) {
		throw new apiError(404, "Workspace not found.");
	}

	const member = await workspaceRepository.fetchWorkspaceMemberByUserId(
		workspace.id,
		userId,
	);

	if (
		!member ||
		(member.role !== WorkspaceRole.OWNER && member.role !== WorkspaceRole.ADMIN)
	) {
		throw new apiError(
			403,
			"You don't have permission to update this project.",
		);
	}

	const project = await projectRepository.findProjectBySlug(
		workspace.id,
		userId,
		projectSlug,
	);

	if (!project) {
		throw new apiError(404, "Project not found.");
	}

	return await projectRepository.updateProject(project.id, data);
};

export const archiveProject = async (
	organizationSlug: string,
	workspaceSlug: string,
	projectSlug: string,
	userId: string,
) => {
	const organization = await organizationRepository.findOrganizationBySlug(
		organizationSlug,
		userId,
	);

	if (!organization) {
		throw new apiError(404, "Organization not found.");
	}

	const workspace = await workspaceRepository.findWorkspaceBySlug(
		organization.id,
		workspaceSlug,
		userId,
	);

	if (!workspace) {
		throw new apiError(404, "Workspace not found.");
	}

	const member = await workspaceRepository.fetchWorkspaceMemberByUserId(
		workspace.id,
		userId,
	);

	if (!member || member.role !== WorkspaceRole.OWNER) {
		throw new apiError(403, "Only workspace owner can archive a project.");
	}

	const project = await projectRepository.findProjectBySlug(
		workspace.id,
		userId,
		projectSlug,
	);

	if (!project) {
		throw new apiError(404, "Project not found.");
	}

	return await projectRepository.archiveProject(project.id);
};

export const addProjectMember = async (
	organizationSlug: string,
	workspaceSlug: string,
	projectSlug: string,
	requesterId: string,
	data: AddProjectMemberInput,
) => {
	const organization = await organizationRepository.findOrganizationBySlug(
		organizationSlug,
		requesterId,
	);

	if (!organization) {
		throw new apiError(404, "Organization not found.");
	}

	const workspace = await workspaceRepository.findWorkspaceBySlug(
		organization.id,
		workspaceSlug,
		requesterId,
	);

	if (!workspace) {
		throw new apiError(404, "Workspace not found.");
	}

	const workspaceMember =
		await workspaceRepository.fetchWorkspaceMemberByUserId(
			workspace.id,
			requesterId,
		);

	if (
		!workspaceMember ||
		(workspaceMember.role !== WorkspaceRole.OWNER &&
			workspaceMember.role !== WorkspaceRole.ADMIN)
	) {
		throw new apiError(
			403,
			"You don't have permission to manage project members.",
		);
	}

	const project = await projectRepository.findProjectBySlug(
		workspace.id,
		requesterId,
		projectSlug,
	);

	if (!project) {
		throw new apiError(404, "Project not found.");
	}

	const user = await authRepository.findUserByEmail(data.email);

	if (!user) {
		throw new apiError(404, "User not found.");
	}

	const targetWorkspaceMember =
		await workspaceRepository.fetchWorkspaceMemberByUserId(
			workspace.id,
			user.id,
		);

	if (
		!targetWorkspaceMember ||
		targetWorkspaceMember.status !== MembershipStatus.ACTIVE
	) {
		throw new apiError(400, "User is not a member of this workspace.");
	}

	const existingMember = await projectRepository.findProjectMemberByUserId(
		project.id,
		user.id,
	);

	if (existingMember) {
		throw new apiError(409, "User is already a member of this project.");
	}

	return await projectRepository.createProjectMember(
		project.id,
		user.id,
		data.role ?? ProjectRole.MEMBER,
	);
};

export const updateProjectMember = async (
	organizationSlug: string,
	workspaceSlug: string,
	projectSlug: string,
	requesterId: string,
	memberId: string,
	role: ProjectRole,
) => {
	const organization = await organizationRepository.findOrganizationBySlug(
		organizationSlug,
		requesterId,
	);

	if (!organization) {
		throw new apiError(404, "Organization not found.");
	}

	const workspace = await workspaceRepository.findWorkspaceBySlug(
		organization.id,
		workspaceSlug,
		requesterId,
	);

	if (!workspace) {
		throw new apiError(404, "Workspace not found.");
	}

	const workspaceMember =
		await workspaceRepository.fetchWorkspaceMemberByUserId(
			workspace.id,
			requesterId,
		);

	if (
		!workspaceMember ||
		(workspaceMember.role !== WorkspaceRole.OWNER &&
			workspaceMember.role !== WorkspaceRole.ADMIN)
	) {
		throw new apiError(
			403,
			"You don't have permission to manage project members.",
		);
	}

	const project = await projectRepository.findProjectBySlug(
		workspace.id,
		requesterId,
		projectSlug,
	);

	if (!project) {
		throw new apiError(404, "Project not found.");
	}

	const target = await projectRepository.findProjectMemberById(
		project.id,
		memberId,
	);

	if (!target) {
		throw new apiError(404, "Project member not found.");
	}

	if (
		workspaceMember.role === WorkspaceRole.ADMIN &&
		target.role === ProjectRole.ADMIN
	) {
		throw new apiError(403, "Admin cannot change another admin's role.");
	}

	return await projectRepository.updateProjectMemberRole(target.id, role);
};

export const fetchAllProjectMembers = async (
	organizationSlug: string,
	workspaceSlug: string,
	projectSlug: string,
	userId: string,
) => {
	const organization = await organizationRepository.findOrganizationBySlug(
		organizationSlug,
		userId,
	);

	if (!organization) {
		throw new apiError(404, "Organization not found.");
	}

	const workspace = await workspaceRepository.findWorkspaceBySlug(
		organization.id,
		workspaceSlug,
		userId,
	);

	if (!workspace) {
		throw new apiError(404, "Workspace not found.");
	}

	const project = await projectRepository.findProjectBySlug(
		workspace.id,
		userId,
		projectSlug,
	);

	if (!project) {
		throw new apiError(404, "Project not found.");
	}

	return await projectRepository.fetchAllProjectMembers(project.id);
};

export const fetchProjectMember = async (
	organizationSlug: string,
	workspaceSlug: string,
	projectSlug: string,
	userId: string,
	memberId: string,
) => {
	const organization = await organizationRepository.findOrganizationBySlug(
		organizationSlug,
		userId,
	);

	if (!organization) {
		throw new apiError(404, "Organization not found.");
	}

	const workspace = await workspaceRepository.findWorkspaceBySlug(
		organization.id,
		workspaceSlug,
		userId,
	);

	if (!workspace) {
		throw new apiError(404, "Workspace not found.");
	}

	const project = await projectRepository.findProjectBySlug(
		workspace.id,
		userId,
		projectSlug,
	);

	if (!project) {
		throw new apiError(404, "Project not found.");
	}

	const member = await projectRepository.findProjectMemberById(
		project.id,
		memberId,
	);

	if (!member) {
		throw new apiError(404, "Project member not found.");
	}

	return member;
};

export const removeProjectMember = async (
	organizationSlug: string,
	workspaceSlug: string,
	projectSlug: string,
	requesterId: string,
	memberId: string,
) => {
	const organization = await organizationRepository.findOrganizationBySlug(
		organizationSlug,
		requesterId,
	);

	if (!organization) {
		throw new apiError(404, "Organization not found.");
	}

	const workspace = await workspaceRepository.findWorkspaceBySlug(
		organization.id,
		workspaceSlug,
		requesterId,
	);

	if (!workspace) {
		throw new apiError(404, "Workspace not found.");
	}

	const workspaceMember =
		await workspaceRepository.fetchWorkspaceMemberByUserId(
			workspace.id,
			requesterId,
		);

	if (
		!workspaceMember ||
		(workspaceMember.role !== WorkspaceRole.OWNER &&
			workspaceMember.role !== WorkspaceRole.ADMIN)
	) {
		throw new apiError(
			403,
			"You don't have permission to remove project members.",
		);
	}

	const project = await projectRepository.findProjectBySlug(
		workspace.id,
		requesterId,
		projectSlug,
	);

	if (!project) {
		throw new apiError(404, "Project not found.");
	}

	const target = await projectRepository.findProjectMemberById(
		project.id,
		memberId,
	);

	if (!target) {
		throw new apiError(404, "Project member not found.");
	}

	if (
		workspaceMember.role === WorkspaceRole.ADMIN &&
		target.role === ProjectRole.ADMIN
	) {
		throw new apiError(403, "Admin cannot remove another admin.");
	}

	return await projectRepository.removeProjectMember(target.id);
};


export const fetchBoard = async (
	organizationSlug: string,
	workspaceSlug: string,
	projectSlug: string,
	userId: string,
) => {
	const organization = await organizationRepository.findOrganizationBySlug(
		organizationSlug,
		userId,
	);

	if (!organization) {
		throw new apiError(404, "Organization not found.");
	}

	const workspace = await workspaceRepository.findWorkspaceBySlug(
		organization.id,
		workspaceSlug,
		userId,
	);

	if (!workspace) {
		throw new apiError(404, "Workspace not found.");
	}

	const project = await projectRepository.findProjectBySlug(
		workspace.id,
		userId,
		projectSlug,
	);

	if (!project) {
		throw new apiError(404, "Project not found.");
	}

	const board = await projectRepository.findBoardByProjectId(
		project.id,
	);

	if (!board) {
		throw new apiError(404, "Board not found.");
	}

	return board;
};

export const updateBoard = async (
	organizationSlug: string,
	workspaceSlug: string,
	projectSlug: string,
	userId: string,
	name: string,
) => {
	const organization = await organizationRepository.findOrganizationBySlug(
		organizationSlug,
		userId,
	);

	if (!organization) {
		throw new apiError(404, "Organization not found.");
	}

	const workspace = await workspaceRepository.findWorkspaceBySlug(
		organization.id,
		workspaceSlug,
		userId,
	);

	if (!workspace) {
		throw new apiError(404, "Workspace not found.");
	}

	const workspaceMember =
		await workspaceRepository.fetchWorkspaceMemberByUserId(
			workspace.id,
			userId,
		);

	if (
		!workspaceMember ||
		(workspaceMember.role !== WorkspaceRole.OWNER &&
			workspaceMember.role !== WorkspaceRole.ADMIN)
	) {
		throw new apiError(
			403,
			"You don't have permission to update this board.",
		);
	}

	const project = await projectRepository.findProjectBySlug(
		workspace.id,
		userId,
		projectSlug,
	);

	if (!project) {
		throw new apiError(404, "Project not found.");
	}

	const board = await projectRepository.findBoardByProjectId(
		project.id,
	);

	if (!board) {
		throw new apiError(404, "Board not found.");
	}

	return await projectRepository.updateBoard(
		board.id,
		name,
	);
};

export const createBoardColumn = async (
	organizationSlug: string,
	workspaceSlug: string,
	projectSlug: string,
	userId: string,
	data: CreateColumnInput,
) => {
	const organization = await organizationRepository.findOrganizationBySlug(
		organizationSlug,
		userId,
	);

	if (!organization) {
		throw new apiError(404, "Organization not found.");
	}

	const workspace = await workspaceRepository.findWorkspaceBySlug(
		organization.id,
		workspaceSlug,
		userId,
	);

	if (!workspace) {
		throw new apiError(404, "Workspace not found.");
	}

	const workspaceMember =
		await workspaceRepository.fetchWorkspaceMemberByUserId(
			workspace.id,
			userId,
		);

	if (
		!workspaceMember ||
		(workspaceMember.role !== WorkspaceRole.OWNER &&
			workspaceMember.role !== WorkspaceRole.ADMIN)
	) {
		throw new apiError(
			403,
			"You don't have permission to manage board columns.",
		);
	}

	const project = await projectRepository.findProjectBySlug(
		workspace.id,
		userId,
		projectSlug,
	);

	if (!project) {
		throw new apiError(404, "Project not found.");
	}

	const board = await projectRepository.findBoardByProjectId(
		project.id,
	);

	if (!board) {
		throw new apiError(404, "Board not found.");
	}

	const columns = await projectRepository.fetchBoardColumns(
		board.id,
	);

	const position = columns.length;

	return await projectRepository.createBoardColumn(
		board.id,
		data.name,
		data.color ?? "",
		position,
	);
};

export const fetchBoardColumns = async (
	organizationSlug: string,
	workspaceSlug: string,
	projectSlug: string,
	userId: string,
) => {
	const organization = await organizationRepository.findOrganizationBySlug(
		organizationSlug,
		userId,
	);

	if (!organization) {
		throw new apiError(404, "Organization not found.");
	}

	const workspace = await workspaceRepository.findWorkspaceBySlug(
		organization.id,
		workspaceSlug,
		userId,
	);

	if (!workspace) {
		throw new apiError(404, "Workspace not found.");
	}

	const project = await projectRepository.findProjectBySlug(
		workspace.id,
		userId,
		projectSlug,
	);

	if (!project) {
		throw new apiError(404, "Project not found.");
	}

	const board = await projectRepository.findBoardByProjectId(
		project.id,
	);

	if (!board) {
		throw new apiError(404, "Board not found.");
	}

	return await projectRepository.fetchBoardColumns(
		board.id,
	);
};

export const fetchBoardColumn = async (
	organizationSlug: string,
	workspaceSlug: string,
	projectSlug: string,
	userId: string,
	columnId: string,
) => {
	const organization = await organizationRepository.findOrganizationBySlug(
		organizationSlug,
		userId,
	);

	if (!organization) {
		throw new apiError(404, "Organization not found.");
	}

	const workspace = await workspaceRepository.findWorkspaceBySlug(
		organization.id,
		workspaceSlug,
		userId,
	);

	if (!workspace) {
		throw new apiError(404, "Workspace not found.");
	}

	const project = await projectRepository.findProjectBySlug(
		workspace.id,
		userId,
		projectSlug,
	);

	if (!project) {
		throw new apiError(404, "Project not found.");
	}

	const board = await projectRepository.findBoardByProjectId(
		project.id,
	);

	if (!board) {
		throw new apiError(404, "Board not found.");
	}

	const column = await projectRepository.findBoardColumnById(
		board.id,
		columnId,
	);

	if (!column) {
		throw new apiError(404, "Board column not found.");
	}

	return column;
};

export const updateBoardColumn = async (
	organizationSlug: string,
	workspaceSlug: string,
	projectSlug: string,
	userId: string,
	columnId: string,
	data: UpdateColumnInput,
) => {
	const organization = await organizationRepository.findOrganizationBySlug(
		organizationSlug,
		userId,
	);

	if (!organization) {
		throw new apiError(404, "Organization not found.");
	}

	const workspace = await workspaceRepository.findWorkspaceBySlug(
		organization.id,
		workspaceSlug,
		userId,
	);

	if (!workspace) {
		throw new apiError(404, "Workspace not found.");
	}

	const workspaceMember =
		await workspaceRepository.fetchWorkspaceMemberByUserId(
			workspace.id,
			userId,
		);

	if (
		!workspaceMember ||
		(workspaceMember.role !== WorkspaceRole.OWNER &&
			workspaceMember.role !== WorkspaceRole.ADMIN)
	) {
		throw new apiError(
			403,
			"You don't have permission to update board columns.",
		);
	}

	const project = await projectRepository.findProjectBySlug(
		workspace.id,
		userId,
		projectSlug,
	);

	if (!project) {
		throw new apiError(404, "Project not found.");
	}

	const board = await projectRepository.findBoardByProjectId(
		project.id,
	);

	if (!board) {
		throw new apiError(404, "Board not found.");
	}

	const column = await projectRepository.findBoardColumnById(
		board.id,
		columnId,
	);

	if (!column) {
		throw new apiError(404, "Board column not found.");
	}

	return await projectRepository.updateBoardColumn(
		column.id,
		data,
	);
};

export const deleteBoardColumn = async (
	organizationSlug: string,
	workspaceSlug: string,
	projectSlug: string,
	userId: string,
	columnId: string,
) => {
	const organization = await organizationRepository.findOrganizationBySlug(
		organizationSlug,
		userId,
	);

	if (!organization) {
		throw new apiError(404, "Organization not found.");
	}

	const workspace = await workspaceRepository.findWorkspaceBySlug(
		organization.id,
		workspaceSlug,
		userId,
	);

	if (!workspace) {
		throw new apiError(404, "Workspace not found.");
	}

	const workspaceMember = await workspaceRepository.fetchWorkspaceMemberByUserId(
		workspace.id,
		userId,
	);

	if (
		!workspaceMember ||
		(workspaceMember.role !== WorkspaceRole.OWNER && workspaceMember.role !== WorkspaceRole.ADMIN)
	) {
		throw new apiError(
			403,
			"You don't have permission to delete board columns.",
		);
	}

	const project = await projectRepository.findProjectBySlug(
		workspace.id,
		userId,
		projectSlug,
	);

	if (!project) {
		throw new apiError(404, "Project not found.");
	}

	const board = await projectRepository.findBoardByProjectId(
		project.id,
	);

	if (!board) {
		throw new apiError(404, "Board not found.");
	}

	const column = await projectRepository.findBoardColumnById(
		board.id,
		columnId,
	);

	if (!column) {
		throw new apiError(404, "Board column not found.");
	}

	return await projectRepository.deleteBoardColumn(
		column.id,
	);
};
