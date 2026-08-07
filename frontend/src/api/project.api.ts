import { api } from "./axios";

export interface ProjectProps {
	id: string;
	workspaceId: string;
	name: string;
	key: string;
	description: string;
	isArchived: boolean;
	createdAt: string;
	updatedAt: string;

	_count: {
		members: number;
		issues: number;
	}
}

export const getProjects = async (workspaceId: string) => {
	return api.get(`/workspaces/${workspaceId}/projects`);
}

export const getProject = async (workspaceId: string, projectId: string) => {
	return api.get(`/workspaces/${workspaceId}/projects/${projectId}`);
}
