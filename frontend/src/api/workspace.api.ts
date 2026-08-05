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
