import type { WorkspaceRole } from "@/generated/prisma/enums";

export interface CreateWorkspaceInput {
	name: string;
	description?: string;
	logoUrl?: string;
}

export interface UpdateWorkspaceInput {
	name?: string;
	description?: string;
	logoUrl?: string;
}

export interface AddWorkspaceMemberInput {
	email: string;
	role: WorkspaceRole;
}
