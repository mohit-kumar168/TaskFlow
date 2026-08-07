import { create } from "zustand";
import { getProject, getProjects, type ProjectProps } from "../api/project.api";

interface ProjectStore {
	projects: ProjectProps[];
	currentProject: ProjectProps | null;
	isLoading: boolean;

	fetchProjects: (workspaceId: string) => Promise<void>;
	fetchProject: (workspaceId: string, projectId: string) => Promise<void>;
	clearCurrentProject: () => void;
}

export const useProjectStore = create<ProjectStore>((set) => ({
	projects: [],
	currentProject: null,
	isLoading: false,

	fetchProjects: async (workspaceId) => {
		try {
			set({ isLoading: true });

			const response = await getProjects(workspaceId);

			set({
				projects: response.data.data,
				isLoading: false,
			});
		} catch (error) {
			console.error(error);
			set({ isLoading: false });
		}
	},
	fetchProject: async (workspaceId, projectId) => {
		try {
			set({ isLoading: true });
			const response = await getProject(workspaceId, projectId);
			set({
				currentProject: response.data.data,
				isLoading: false
			})
		} catch (error) {
			console.error(error);
			set({ isLoading: false });

		}
	},
	clearCurrentProject: async () => {
		set({ currentProject: null });
	}
}));
