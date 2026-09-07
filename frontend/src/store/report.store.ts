import { create } from "zustand";

import {
  getIssueStatusReport,
  getIssuePriorityReport,
  getIssueTrendReport,
  getSprintProgressReport,
  type IssueStatusReport,
  type IssuePriorityReport,
  type IssueTrendReport,
  type SprintProgressReport,
} from "../api/report.api";

interface ReportStore {
  issueStatusReport: IssueStatusReport[];
  issuePriorityReport: IssuePriorityReport[];
  issueTrendReport: IssueTrendReport[];
  sprintProgressReport: SprintProgressReport[];

  isLoading: boolean;

  fetchReports: (
    organizationSlug: string,
    workspaceSlug: string,
    projectSlug: string,
  ) => Promise<void>;

  clearReports: () => void;
}

let latestRequestId = 0;

export const useReportStore = create<ReportStore>((set) => ({
  issueStatusReport: [],
  issuePriorityReport: [],
  issueTrendReport: [],
  sprintProgressReport: [],

  isLoading: false,

  fetchReports: async (
    organizationSlug: string,
    workspaceSlug: string,
    projectSlug: string,
  ) => {
    const requestId = ++latestRequestId;

    try {
      set({
        isLoading: true,
        issueStatusReport: [],
        issuePriorityReport: [],
        issueTrendReport: [],
        sprintProgressReport: [],
      });

      const [
        statusResponse,
        priorityResponse,
        trendResponse,
        sprintResponse,
      ] = await Promise.all([
        getIssueStatusReport(organizationSlug, workspaceSlug, projectSlug),
        getIssuePriorityReport(organizationSlug, workspaceSlug, projectSlug),
        getIssueTrendReport(organizationSlug, workspaceSlug, projectSlug),
        getSprintProgressReport(organizationSlug, workspaceSlug, projectSlug),
      ]);

      if (requestId !== latestRequestId) {
        return;
      }

      set({
        issueStatusReport: statusResponse.data.data,
        issuePriorityReport: priorityResponse.data.data,
        issueTrendReport: trendResponse.data.data,
        sprintProgressReport: sprintResponse.data.data,
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to fetch reports:", error);
      if (requestId !== latestRequestId) {
        return;
      }

      set({
        isLoading: false,
        issueStatusReport: [],
        issuePriorityReport: [],
        issueTrendReport: [],
        sprintProgressReport: [],
      });

    }
  },

  clearReports: () => {
    set({
      issueStatusReport: [],
      issuePriorityReport: [],
      issueTrendReport: [],
      sprintProgressReport: [],
    });
  },
}));
