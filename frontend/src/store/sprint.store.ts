import { create } from "zustand";

import {
  createSprint,
  getAllSprints,
  getSprint,
  startSprint,
  completeSprint,
  getSprintIssues,
  type SprintProps,
  type SprintIssueProps,
  type CreateSprintProps,
  type CompleteSprintProps,
} from "@/api/sprint.api";
import type { IssueProps } from "@/api/issue.api";

interface SprintStore {
  sprints: SprintProps[];
  currentSprint: SprintProps | null;
  sprintIssues: IssueProps[];

  isLoading: boolean;
  isCreating: boolean;
  isStarting: boolean;
  isCompleting: boolean;
  isFetchingIssues: boolean;

  fetchSprints: (
    organizationSlug: string,
    workspaceSlug: string,
    projectSlug: string,
  ) => Promise<void>;

  fetchSprint: (
    organizationSlug: string,
    workspaceSlug: string,
    projectSlug: string,
    sprintId: string,
  ) => Promise<SprintProps | null>;

  createSprint: (
    organizationSlug: string,
    workspaceSlug: string,
    projectSlug: string,
    data: CreateSprintProps,
  ) => Promise<SprintProps | null>;

  startSprint: (
    organizationSlug: string,
    workspaceSlug: string,
    projectSlug: string,
    sprintId: string,
  ) => Promise<SprintProps | null>;

  completeSprint: (
    organizationSlug: string,
    workspaceSlug: string,
    projectSlug: string,
    sprintId: string,
    data: CompleteSprintProps,
  ) => Promise<SprintProps | null>;

  fetchSprintIssues: (
    organizationSlug: string,
    workspaceSlug: string,
    projectSlug: string,
    sprintId: string,
  ) => Promise<IssueProps[]>;

  setCurrentSprint: (
    sprint: SprintProps | null,
  ) => void;

  clearSprint: () => void;
}

export const useSprintStore = create<SprintStore>((set) => ({
  sprints: [],
  currentSprint: null,
  sprintIssues: [],

  isLoading: false,
  isCreating: false,
  isStarting: false,
  isCompleting: false,
  isFetchingIssues: false,

  fetchSprints: async (
    organizationSlug,
    workspaceSlug,
    projectSlug,
  ) => {
    try {
      set({
        isLoading: true,
      });

      const response = await getAllSprints(
        organizationSlug,
        workspaceSlug,
        projectSlug,
      );

      set({
        sprints: response.data.data,
        isLoading: false,
      });
    } catch (error) {
      console.error(
        "Failed to fetch sprints:",
        error,
      );

      set({
        sprints: [],
        isLoading: false,
      });
    }
  },

  fetchSprint: async (
    organizationSlug,
    workspaceSlug,
    projectSlug,
    sprintId,
  ) => {
    try {
      const response = await getSprint(
        organizationSlug,
        workspaceSlug,
        projectSlug,
        sprintId,
      );

      const sprint = response.data.data;

      set({
        currentSprint: sprint,
      });

      return sprint;
    } catch (error) {
      console.error(
        "Failed to fetch sprint:",
        error,
      );

      set({
        currentSprint: null,
      });

      return null;
    }
  },

  createSprint: async (
    organizationSlug,
    workspaceSlug,
    projectSlug,
    data,
  ) => {
    try {
      set({
        isCreating: true,
      });

      const response = await createSprint(
        organizationSlug,
        workspaceSlug,
        projectSlug,
        data,
      );

      const sprint = response.data.data;

      set((state) => ({
        sprints: [
          sprint,
          ...state.sprints,
        ],
        isCreating: false,
      }));

      return sprint;
    } catch (error) {
      console.error(
        "Failed to create sprint:",
        error,
      );

      set({
        isCreating: false,
      });

      return null;
    }
  },

  startSprint: async (
    organizationSlug,
    workspaceSlug,
    projectSlug,
    sprintId,
  ) => {
    try {
      set({
        isStarting: true,
      });

      const response = await startSprint(
        organizationSlug,
        workspaceSlug,
        projectSlug,
        sprintId,
      );

      const sprint = response.data.data;

      set((state) => ({
        sprints: state.sprints.map(
          (item) =>
            item.id === sprint.id
              ? sprint
              : item,
        ),

        currentSprint:
          state.currentSprint?.id === sprint.id
            ? sprint
            : state.currentSprint,

        isStarting: false,
      }));

      return sprint;
    } catch (error) {
      console.error(
        "Failed to start sprint:",
        error,
      );

      set({
        isStarting: false,
      });

      return null;
    }
  },

  completeSprint: async (
    organizationSlug,
    workspaceSlug,
    projectSlug,
    sprintId,
    data,
  ) => {
    try {
      set({
        isCompleting: true,
      });

      const response = await completeSprint(
        organizationSlug,
        workspaceSlug,
        projectSlug,
        sprintId,
        data,
      );

      const sprint = response.data.data;

      set((state) => ({
        sprints: state.sprints.map(
          (item) =>
            item.id === sprint.id
              ? sprint
              : item,
        ),

        currentSprint:
          state.currentSprint?.id === sprint.id
            ? sprint
            : state.currentSprint,

        isCompleting: false,
      }));

      return sprint;
    } catch (error) {
      console.error(
        "Failed to complete sprint:",
        error,
      );

      set({
        isCompleting: false,
      });

      return null;
    }
  },

  fetchSprintIssues: async (
    organizationSlug,
    workspaceSlug,
    projectSlug,
    sprintId,
  ) => {
    try {
      set({
        isFetchingIssues: true,
      });

      const response = await getSprintIssues(
        organizationSlug,
        workspaceSlug,
        projectSlug,
        sprintId,
      );

      const issues = response.data.data;

      set({
        sprintIssues: issues,
        isFetchingIssues: false,
      });

      return issues;
    } catch (error) {
      console.error(
        "Failed to fetch sprint issues:",
        error,
      );

      set({
        sprintIssues: [],
        isFetchingIssues: false,
      });

      return [];
    }
  },

  setCurrentSprint: (sprint) => {
    set({
      currentSprint: sprint,
    });
  },

  clearSprint: () => {
    set({
      currentSprint: null,
      sprintIssues: [],
    });
  },
}),
);
