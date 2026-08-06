import { create } from "zustand";
import {
	getWorkspace,
	getWorkspaceMembers,
	getWorkspaces,
	type WorkspaceMemberProps,
} from "@/api/workspace.api";

interface WorkspaceStore {
	workspaces: WorkspaceMemberProps[];
	currentWorkspace: WorkspaceMemberProps | null;
	isLoading: boolean;

	fetchWorkspaces: () => Promise<void>;
	fetchWorkspace: (workspaceId: string) => Promise<void>;
	fetchWorkspaceMembers: (workspaceId: string) => Promise<void>;
}

export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
	workspaces: [],
	currentWorkspace: null,
	isLoading: false,

	fetchWorkspaces: async () => {
		try {
			set({ isLoading: true });

			const response = await getWorkspaces();

			set({
				workspaces: response.data.data,
				isLoading: false,
			});
		} catch (err) {
			console.error(err);
			set({ isLoading: false });
		}
	},

	fetchWorkspace: async (workspaceId: string) => {
		try {
			set({ isLoading: true, currentWorkspace: null });

			const response = await getWorkspace(workspaceId);

			set({
				currentWorkspace: response.data.data,
				isLoading: false,
			});
		} catch (err) {
			console.error(err);
			set({ isLoading: false, currentWorkspace: null });
		}
	},
	fetchWorkspaceMembers: async (workspaceId: string) => {
		try {
			set({ isLoading: true });

			const response = await getWorkspaceMembers(workspaceId);

			set({
				currentWorkspace: response.data.data,
				isLoading: false,
			});
		} catch (err) {
			console.error(err);
			set({ isLoading: false });
		}
	},
}));
