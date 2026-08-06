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
}

export const createWorkspace = (data: CreateWorkshopProps) => {
	return api.post("/workspace", data);
}

export const getWorkspaces = () => {
	return api.get("/workspace");
}

export const getWorkspace = (workspaceId: string) => {
	return api.get(`/workspace/${workspaceId}`);
}

export const getWorkspaceMembers = (workspaceId: string) => {
	return api.get(`/workspace/${workspaceId}/members`);
}
