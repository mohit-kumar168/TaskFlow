import { create } from "zustand";
import {
  getWorkspace,
  getWorkspaceMembers,
  getWorkspaces,
  createWorkspace,
  type WorkspaceProps,
  type CreateWorkspaceProps,
} from "@/api/workspace.api";

interface WorkspaceStore {
  workspaces: WorkspaceProps[];
  currentWorkspace: WorkspaceProps | null;
  isLoading: boolean;

  fetchWorkspaces: (organizationSlug: string) => Promise<void>;

  fetchWorkspace: (
    organizationSlug: string,
    workspaceSlug: string,
  ) => Promise<void>;

  fetchWorkspaceMembers: (
    organizationSlug: string,
    workspaceSlug: string,
  ) => Promise<void>;

  createWorkspace: (organizationSlug: string, data: CreateWorkspaceProps) => Promise<WorkspaceProps | null>;
}

let workspaceRequestId = 0;

export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  workspaces: [],
  currentWorkspace: null,
  isLoading: false,

  fetchWorkspaces: async (organizationSlug) => {
    const requestId = ++workspaceRequestId;

    try {
      set({
        isLoading: true,
        workspaces: [],
        currentWorkspace: null,
      });

      const response = await getWorkspaces(organizationSlug);

      if (requestId !== workspaceRequestId) {
        return;
      }

      set({
        workspaces: response.data.data,
        isLoading: false,
      });
    } catch (error) {
      if (requestId !== workspaceRequestId) {
        return;
      }

      console.error("Failed to fetch workspaces:", error);

      set({
        workspaces: [],
        currentWorkspace: null,
        isLoading: false,
      });
    }
  },

  fetchWorkspace: async (organizationSlug, workspaceSlug) => {
    try {
      set({
        isLoading: true,
        currentWorkspace: null,
      });

      const response = await getWorkspace(organizationSlug, workspaceSlug);

      set({
        currentWorkspace: response.data.data,
        isLoading: false,
      });
    } catch (error) {
      console.error(error);

      set({
        currentWorkspace: null,
        isLoading: false,
      });
    }
  },

  fetchWorkspaceMembers: async (organizationSlug, workspaceSlug) => {
    try {
      set({ isLoading: true });

      const response = await getWorkspaceMembers(
        organizationSlug,
        workspaceSlug,
      );

      console.log(response.data.data);

      set({ isLoading: false });
    } catch (error) {
      console.error(error);
      set({ isLoading: false });
    }
  },

  createWorkspace: async (organizationSlug: string, data: CreateWorkspaceProps) => {
    try {
      set({ isLoading: true });

      const response = await createWorkspace(organizationSlug, data);
      const workspace = response.data.data;

      set((state) => ({
        workspaces: [...state.workspaces, workspace],
        currentWorkspace: workspace,
        isLoading: false,
      }));
      return workspace;
    } catch (error) {
      console.error(error);
      set({ isLoading: false });
      return null;
    }
  },
}));
