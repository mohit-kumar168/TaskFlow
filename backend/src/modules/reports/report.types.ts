export interface IssueStatusReport {
  status: string;
  coutn: number;
}

export interface IssuePriorityReport {
  priority: string;
  count: number;
}

export interface SprintProgressReport {
  srpintId: string;
  sprintName: string;
  totalIssues: number;
  completedIssues: number;
  remainingIssues: number;
  progress: number;
}
