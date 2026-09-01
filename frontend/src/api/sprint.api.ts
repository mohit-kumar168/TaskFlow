import { api } from "./axios";

export interface SprintProps {
  id: string;
  projectId: string;
  name: string;
  goal?: string | null;
  status: "PLANNING" | "ACTIVE" | "COMPLETED";
  startDate?: string | null;
  endDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SprintIssueProps {
  id: string;
  issueKey: string;
  title: string;
  description?: string | null;
  status: string;
  priority: string;
  type: string;
  position: string;
  sprintId?: string | null;
  columnId?: string | null;
  assigneeId?: string | null;
  dueDate?: string | null;
  isArchived: boolean;
}

export interface CreateSprintProps {
  name: string;
  goal?: string;
  startDate?: string;
  endDate?: string;
}

export interface CompleteSprintProps {
  moveIncompleteTo: "BACKLOG" | "NEXT_SPRINT";
  nextSprintId?: string;
}

const getSprintBaseUrl = (
  organizationSlug: string,
  workspaceSlug: string,
  projectSlug: string,
) => {
  return `/organizations/${organizationSlug}/workspaces/${workspaceSlug}/projects/${projectSlug}/sprints`;
};

export const createSprint = (
  organizationSlug: string,
  workspaceSlug: string,
  projectSlug: string,
  data: CreateSprintProps,
) => {
  return api.post(
    getSprintBaseUrl(organizationSlug, workspaceSlug, projectSlug),
    data,
  );
};

export const getAllSprints = (
  organizationSlug: string,
  workspaceSlug: string,
  projectSlug: string,
) => {
  return api.get(getSprintBaseUrl(organizationSlug, workspaceSlug, projectSlug));
};

export const getSprint = (
  organizationSlug: string,
  workspaceSlug: string,
  projectSlug: string,
  sprintId: string,
) => {
  return api.get(
    `${getSprintBaseUrl(organizationSlug, workspaceSlug, projectSlug)}/${sprintId}`
  );
};

export const startSprint = (
  organizationSlug: string,
  workspaceSlug: string,
  projectSlug: string,
  sprintId: string,
) => {
  return api.post(
    `${getSprintBaseUrl(organizationSlug, workspaceSlug, projectSlug)}/${sprintId}/start`
  );
};

export const completeSprint = (
  organizationSlug: string,
  workspaceSlug: string,
  projectSlug: string,
  sprintId: string,
  data: CompleteSprintProps,
) => {
  return api.post(
    `${getSprintBaseUrl(organizationSlug, workspaceSlug, projectSlug)}/${sprintId}/complete`,
    data,
  );
};

export const getSprintIssues = (
  organizationSlug: string,
  workspaceSlug: string,
  projectSlug: string,
  sprintId: string,
) => {
  return api.get(
    `${getSprintBaseUrl(organizationSlug, workspaceSlug, projectSlug)}/${sprintId}/issues`
  );
};
