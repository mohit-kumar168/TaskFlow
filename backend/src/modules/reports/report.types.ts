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
