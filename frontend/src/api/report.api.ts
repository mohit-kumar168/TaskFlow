import { api } from "./axios";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface IssueStatusReport {
  status: string;
  count: number;
}

export interface IssuePriorityReport {
  priority: string;
  count: number;
}

export interface IssueTrendReport {
  date: string;
  count: number;
}

export interface SprintProgressReport {
  sprintId: string;
  sprintName: string;
  totalIssues: number;
  completedIssues: number;
  remainingIssues: number;
  progress: number;
}

const getReportBaseUrl = (
  organizationSlug: string,
  workspaceSlug: string,
  projectSlug: string,
) => {
  return `/organizations/${organizationSlug}/workspaces/${workspaceSlug}/projects/${projectSlug}/reports`;
};

export const getIssueStatusReport = (
  organizationSlug: string,
  workspaceSlug: string,
  projectSlug: string,
) => {
  return api.get<ApiResponse<IssueStatusReport[]>>(
    `${getReportBaseUrl(organizationSlug, workspaceSlug, projectSlug)}/issue-status`,
  );
};

export const getIssuePriorityReport = (
  organizationSlug: string,
  workspaceSlug: string,
  projectSlug: string,
) => {
  return api.get<ApiResponse<IssuePriorityReport[]>>(
    `${getReportBaseUrl(organizationSlug, workspaceSlug, projectSlug)}/issue-priority`,
  );
};

export const getIssueTrendReport = (
  organizationSlug: string,
  workspaceSlug: string,
  projectSlug: string,
) => {
  return api.get<ApiResponse<IssueTrendReport[]>>(
    `${getReportBaseUrl(organizationSlug, workspaceSlug, projectSlug)}/issue-trend`,
  );
};

export const getSprintProgressReport = (
  organizationSlug: string,
  workspaceSlug: string,
  projectSlug: string,
) => {
  return api.get<ApiResponse<SprintProgressReport[]>>(
    `${getReportBaseUrl(organizationSlug, workspaceSlug, projectSlug)}/sprint-progress`,
  );
};
