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

export const getWorkspaces = () => {
	return api.get("/workspace");
}
