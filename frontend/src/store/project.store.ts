import { create } from "zustand";

import {
  createProject,
  getProject,
  getProjects,
  getBoard,
  updateBoard,
  getBoardColumns,
  createBoardColumn,
  getBoardColumn,
  updateBoardColumn,
  deleteBoardColumn,
  type CreateProjectProps,
  type ProjectProps,
  type BoardProps,
  type BoardColumnProps,
  type CreateBoardColumnProps,
  type UpdateBoardColumnProps,
} from "../api/project.api";

interface ProjectStore {
  projects: ProjectProps[];
  projectsByWorkspace: Record<string, ProjectProps[]>;

  currentProject: ProjectProps | null;

  currentBoard: BoardProps | null;
  boardColumns: BoardColumnProps[];

  isLoading: boolean;
  isProjectLoading: boolean;
  isBoardLoading: boolean;
  isBoardColumnsLoading: boolean;

  fetchProjects: (
    organizationSlug: string,
    workspaceSlug: string,
  ) => Promise<void>;

  fetchProject: (
    organizationSlug: string,
    workspaceSlug: string,
    projectSlug: string,
  ) => Promise<void>;

  createProject: (
    organizationSlug: string,
    workspaceSlug: string,
    data: CreateProjectProps,
  ) => Promise<ProjectProps | null>;

  fetchBoard: (
    organizationSlug: string,
    workspaceSlug: string,
    projectSlug: string,
  ) => Promise<void>;

  updateBoard: (
    organizationSlug: string,
    workspaceSlug: string,
    projectSlug: string,
    name: string,
  ) => Promise<void>;

  fetchBoardColumns: (
    organizationSlug: string,
    workspaceSlug: string,
    projectSlug: string,
  ) => Promise<void>;

  fetchBoardColumn: (
    organizationSlug: string,
    workspaceSlug: string,
    projectSlug: string,
    columnId: string,
  ) => Promise<BoardColumnProps | null>;

  createBoardColumn: (
    organizationSlug: string,
    workspaceSlug: string,
    projectSlug: string,
    data: CreateBoardColumnProps,
  ) => Promise<BoardColumnProps | null>;

  updateBoardColumn: (
    organizationSlug: string,
    workspaceSlug: string,
    projectSlug: string,
    columnId: string,
    data: UpdateBoardColumnProps,
  ) => Promise<BoardColumnProps | null>;

  deleteBoardColumn: (
    organizationSlug: string,
    workspaceSlug: string,
    projectSlug: string,
    columnId: string,
  ) => Promise<boolean>;

  clearCurrentProject: () => void;

  clearBoard: () => void;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  projects: [],
  projectsByWorkspace: {},

  currentProject: null,

  currentBoard: null,
  boardColumns: [],

  isLoading: false,
  isProjectLoading: false,
  isBoardLoading: false,
  isBoardColumnsLoading: false,

  fetchProjects: async (organizationSlug, workspaceSlug) => {
    try {
      set({ isLoading: true });

      const response = await getProjects(organizationSlug, workspaceSlug);

      const projects = response.data.data;

      set((state) => ({
        projects,
        projectsByWorkspace: {
          ...state.projectsByWorkspace,
          [workspaceSlug]: projects,
        },
        isLoading: false,
      }));
    } catch (error) {
      console.error("Failed to fetch projects:", error);

      set({ isLoading: false });
    }
  },

  fetchProject: async (organizationSlug, workspaceSlug, projectSlug) => {
    try {
      set({
        isProjectLoading: true,
        currentProject: null,
      });

      console.log("Fetching project:", {
        organizationSlug,
        workspaceSlug,
        projectSlug,
      });

      const response = await getProject(
        organizationSlug,
        workspaceSlug,
        projectSlug,
      );

      console.log("Project loaded:", response.data.data);

      set({
        currentProject: response.data.data,
        isProjectLoading: false,
      });
    } catch (error: any) {
      console.error("Failed to fetch project:", error.response?.data || error);

      set({
        currentProject: null,
        isProjectLoading: false,
      });
    }
  },

  createProject: async (organizationSlug, workspaceSlug, data) => {
    try {
      set({ isLoading: true });

      const response = await createProject(
        organizationSlug,
        workspaceSlug,
        data,
      );

      const newProject = response.data.data;

      set((state) => ({
        projects: [...state.projects, newProject],

        projectsByWorkspace: {
          ...state.projectsByWorkspace,
          [workspaceSlug]: [
            ...(state.projectsByWorkspace[workspaceSlug] ?? []),
            newProject,
          ],
        },

        currentProject: newProject,
        isLoading: false,
      }));

      return newProject;
    } catch (error: any) {
      console.error("CREATE PROJECT FAILED");
      set({ isLoading: false });

      return null;
    }
  },

  fetchBoard: async (organizationSlug, workspaceSlug, projectSlug) => {
    try {
      set({
        isBoardLoading: true,
      });

      console.log("Fetching board:", {
        organizationSlug,
        workspaceSlug,
        projectSlug,
      });

      const response = await getBoard(
        organizationSlug,
        workspaceSlug,
        projectSlug,
      );

      console.log("Board loaded:", response.data.data);

      set({
        currentBoard: response.data.data,
        isBoardLoading: false,
      });
    } catch (error: any) {
      console.error("Failed to fetch board:", error.response?.data || error);

      set({
        currentBoard: null,
        isBoardLoading: false,
      });
    }
  },

  updateBoard: async (organizationSlug, workspaceSlug, projectSlug, name) => {
    try {
      set({ isLoading: true });

      const response = await updateBoard(
        organizationSlug,
        workspaceSlug,
        projectSlug,
        name,
      );

      set({
        currentBoard: response.data.data,
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to update board:", error);

      set({ isLoading: false });
    }
  },

  fetchBoardColumns: async (organizationSlug, workspaceSlug, projectSlug) => {
    try {
      set({
        isBoardColumnsLoading: true,
      });

      console.log("Fetching board columns:", {
        organizationSlug,
        workspaceSlug,
        projectSlug,
      });

      const response = await getBoardColumns(
        organizationSlug,
        workspaceSlug,
        projectSlug,
      );

      console.log("Board columns loaded:", response.data.data);

      set({
        boardColumns: response.data.data,
        isBoardColumnsLoading: false,
      });
    } catch (error: any) {
      console.error(
        "Failed to fetch board columns:",
        error.response?.data || error,
      );

      set({
        boardColumns: [],
        isBoardColumnsLoading: false,
      });
    }
  },

  fetchBoardColumn: async (
    organizationSlug,
    workspaceSlug,
    projectSlug,
    columnId,
  ) => {
    try {
      const response = await getBoardColumn(
        organizationSlug,
        workspaceSlug,
        projectSlug,
        columnId,
      );

      return response.data.data;
    } catch (error) {
      console.error("Failed to fetch board column:", error);

      return null;
    }
  },

  createBoardColumn: async (
    organizationSlug,
    workspaceSlug,
    projectSlug,
    data,
  ) => {
    try {
      set({ isLoading: true });

      const response = await createBoardColumn(
        organizationSlug,
        workspaceSlug,
        projectSlug,
        data,
      );

      const column = response.data.data;

      set((state) => ({
        boardColumns: [...state.boardColumns, column],
        isLoading: false,
      }));

      return column;
    } catch (error: any) {
      console.error("CREATE BOARD COLUMN FAILED");
      console.error("Status:", error.response?.status);
      console.error("Response:", error.response?.data);

      set({ isLoading: false });

      return null;
    }
  },

  updateBoardColumn: async (
    organizationSlug,
    workspaceSlug,
    projectSlug,
    columnId,
    data,
  ) => {
    try {
      set({ isLoading: true });

      const response = await updateBoardColumn(
        organizationSlug,
        workspaceSlug,
        projectSlug,
        columnId,
        data,
      );

      const updatedColumn = response.data.data;

      set((state) => ({
        boardColumns: state.boardColumns.map((column) =>
          column.id === columnId ? updatedColumn : column,
        ),
        isLoading: false,
      }));

      return updatedColumn;
    } catch (error: any) {
      console.error("UPDATE BOARD COLUMN FAILED");
      console.error("Status:", error.response?.status);
      console.error("Response:", error.response?.data);

      set({ isLoading: false });

      return null;
    }
  },

  deleteBoardColumn: async (
    organizationSlug,
    workspaceSlug,
    projectSlug,
    columnId,
  ) => {
    try {
      set({ isLoading: true });

      await deleteBoardColumn(
        organizationSlug,
        workspaceSlug,
        projectSlug,
        columnId,
      );

      set((state) => ({
        boardColumns: state.boardColumns.filter(
          (column) => column.id !== columnId,
        ),
        isLoading: false,
      }));

      return true;
    } catch (error: any) {
      console.error("DELETE BOARD COLUMN FAILED");
      console.error("Status:", error.response?.status);
      console.error("Response:", error.response?.data);

      set({ isLoading: false });

      return false;
    }
  },

  clearCurrentProject: () => {
    set({
      currentProject: null,
    });
  },

  clearBoard: () => {
    set({
      currentBoard: null,
      boardColumns: [],
    });
  },
}));
