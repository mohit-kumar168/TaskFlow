import { api } from "./axios";

export interface ProjectProps {
	id: string;
	workspaceId: string;
	name: string;
	slug: string;
	key: string;
	description: string;
	iconUrl?: string;
	isArchived: boolean;
	createdAt: string;
	updatedAt: string;

	_count: {
		members: number;
		issues: number;
	};
}

export interface ProjectMemberProps {
	id: string;
	projectId: string;
	userId: string;
	role: "ADMIN" | "MEMBER";
	joinedAt: string;
	user: {
		id: string;
		name: string;
		email: string;
		avatarUrl?: string | null;
	};
}

export interface AddProjectMemberProps {
	email: string;
	role?: "ADMIN" | "MEMBER";
}

export interface CreateProjectProps {
	name: string;
	key: string;
	description?: string;
	iconUrl?: string;
	boardName: string;
}

export interface BoardProps {
	id: string;
	projectId: string;
	name: string;
	createdAt: string;
	updatedAt: string;
}

export interface BoardColumnProps {
	id: string;
	boardId: string;
	name: string;
	color?: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface CreateBoardColumnProps {
	name: string;
	color?: string;
}

export interface UpdateBoardColumnProps {
	name?: string;
	color?: string;
}

const getProjectBaseUrl = (
	organizationSlug: string,
	workspaceSlug: string,
	projectSlug: string,
) => {
	return `/organizations/${organizationSlug}/workspaces/${workspaceSlug}/projects/${projectSlug}`;
};

export const createProject = async (
	organizationSlug: string,
	workspaceSlug: string,
	data: CreateProjectProps,
) => {
	return api.post(
		`/organizations/${organizationSlug}/workspaces/${workspaceSlug}`,
		data,
	);
};

export const getProjects = async (
	organizationSlug: string,
	workspaceSlug: string,
) => {
	return api.get(
		`/organizations/${organizationSlug}/workspaces/${workspaceSlug}/projects`,
	);
};

export const getProject = async (
	organizationSlug: string,
	workspaceSlug: string,
	projectSlug: string,
) => {
	return api.get(
		getProjectBaseUrl(organizationSlug, workspaceSlug, projectSlug),
	);
};

export const updateProject = (
	organizationSlug: string,
	workspaceSlug: string,
	projectSlug: string,
	data: {
		name?: string,
		description?: string,
	},
) => {
	return api.patch(
		getProjectBaseUrl(organizationSlug, workspaceSlug, projectSlug),
		data
	)
};

export const archiveProject = (
	organizationSlug: string,
	workspaceSlug: string,
	projectSlug: string,
) => {
	return api.delete(
		getProjectBaseUrl(organizationSlug, workspaceSlug, projectSlug),
	)
};

export const getProjectMembers = async (
	organizationSlug: string,
	workspaceSlug: string,
	projectSlug: string,
) => {
	return api.get(
		`${getProjectBaseUrl(organizationSlug, workspaceSlug, projectSlug)}/members`,
	);
};

export const getProjectMember = async (
	organizationSlug: string,
	workspaceSlug: string,
	projectSlug: string,
	memberId: string,
) => {
	return api.get(
		`${getProjectBaseUrl(organizationSlug, workspaceSlug, projectSlug)}/members/${memberId}`,
	);
};

export const addProjectMember = async (
	organizationSlug: string,
	workspaceSlug: string,
	projectSlug: string,
	data: AddProjectMemberProps,
) => {
	return api.post(
		`${getProjectBaseUrl(organizationSlug, workspaceSlug, projectSlug)}/members`,
		data,
	);
};

export const updateProjectMemberRole = async (
	organizationSlug: string,
	workspaceSlug: string,
	projectSlug: string,
	memberId: string,
	role: "ADMIN" | "MEMBER",
) => {
	return api.patch(
		`${getProjectBaseUrl(organizationSlug, workspaceSlug, projectSlug)}/members/${memberId}`,
		{ role },
	);
};

export const removeProjectMember = async (
	organizationSlug: string,
	workspaceSlug: string,
	projectSlug: string,
	memberId: string,
) => {
	return api.delete(
		`${getProjectBaseUrl(organizationSlug, workspaceSlug, projectSlug)}/members/${memberId}`,
	);
};

export const getBoard = async (
	organizationSlug: string,
	workspaceSlug: string,
	projectSlug: string,
) => {
	return api.get(
		`${getProjectBaseUrl(organizationSlug, workspaceSlug, projectSlug)}/board`,
	);
};

export const updateBoard = async (
	organizationSlug: string,
	workspaceSlug: string,
	projectSlug: string,
	name: string,
) => {
	return api.patch(
		`${getProjectBaseUrl(organizationSlug, workspaceSlug, projectSlug)}/board`,
		{ name },
	);
};

export const createBoardColumn = async (
	organizationSlug: string,
	workspaceSlug: string,
	projectSlug: string,
	data: CreateBoardColumnProps,
) => {
	return api.post(
		`${getProjectBaseUrl(organizationSlug, workspaceSlug, projectSlug)}/board/columns`,
		data,
	);
};

export const getBoardColumns = async (
	organizationSlug: string,
	workspaceSlug: string,
	projectSlug: string,
) => {
	return api.get(
		`${getProjectBaseUrl(organizationSlug, workspaceSlug, projectSlug)}/board/columns`,
	);
};

export const getBoardColumn = async (
	organizationSlug: string,
	workspaceSlug: string,
	projectSlug: string,
	columnId: string,
) => {
	return api.get(
		`${getProjectBaseUrl(organizationSlug, workspaceSlug, projectSlug)}/board/columns/${columnId}`,
	);
};

export const updateBoardColumn = async (
	organizationSlug: string,
	workspaceSlug: string,
	projectSlug: string,
	columnId: string,
	data: UpdateBoardColumnProps
) => {
	return api.patch(
		`${getProjectBaseUrl(organizationSlug, workspaceSlug, projectSlug)}/board/columns/${columnId}`,
		data,
	);
};

export const deleteBoardColumn = async (
	organizationSlug: string,
	workspaceSlug: string,
	projectSlug: string,
	columnId: string
) => {
	return api.delete(
		`${getProjectBaseUrl(organizationSlug, workspaceSlug, projectSlug)}/board/columns/${columnId}`,
	);
};
