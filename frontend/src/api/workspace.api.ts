import { api } from "./axios";

export interface WorkspaceProps {
	id: string;
	name: string;
	slug: string;
	description: string;
	logoUrl: string | null;
	ownerId: string;
	isArchived: boolean;
	createdAt: string;
	updatedAt: string;

	_count?: {
		members: number;
		projects: number;
	}
}

export interface WorkspaceMemberProps {
	id: string;
	workspaceId: string;
	userId: string;
	role: "OWNER" | "ADMIN" | "MEMBER";
	status: "active" | "inactive";
	joinedAt: string;
	workspace: WorkspaceProps;
}

export interface CreateWorkshopProps {
	name: string;
	description: string;
	logoUrl?: string;
}

export const createWorkspace = (organizationSlug: string, data: CreateWorkshopProps) => {
	return api.post(`/organizations/${organizationSlug}/workspaces`, data);
}

export const getWorkspaces = (organizationSlug: string) => {
	return api.get(`/organizations/${organizationSlug}/workspaces`);
}

export const getWorkspace = (organizationSlug: string, workspaceId: string) => {
	return api.get(`/organizations/${organizationSlug}/workspaces/${workspaceId}`);
}

export const getWorkspaceMembers = (organizationSlug: string, workspaceId: string) => {
	return api.get(`/organizations/${organizationSlug}/workspaces/${workspaceId}/members`);
}
