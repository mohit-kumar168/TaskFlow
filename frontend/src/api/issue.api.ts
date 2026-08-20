import { api } from "./axios";

export type IssueType =
	| "TASK"
	| "BUG"
	| "STORY"
	| "EPIC";

export type IssuePriority =
	| "LOW"
	| "MEDIUM"
	| "HIGH"
	| "URGENT";

export interface IssueProps {
	id: string;
	projectId: string;
	columnId: string;
	reporterId: string;
	assigneeId: string | null;

	issueKey: string;
	title: string;
	description: string | null;
	type: IssueType;
	priority: IssuePriority;

	status: "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
	dueDate: string | null;
	position: number;
	isArchived: boolean;

	createdAt: string;
	updatedAt: string;
}

export interface CreateIssueProps {
	title: string;
	description?: string;
	type?: IssueType;
	priority?: IssuePriority;
	dueDate?: string;
	email?: string;
	columnId?: string;
}

export interface UpdateIssueProps {
	title?: string;
	description?: string;
	type?: IssueType;
	priority?: IssuePriority;
	dueDate?: string;
	email?: string;
}

export interface MoveIssueProps {
	columnId: string;
}

const getIssueBasePath = (
	organizationSlug: string,
	workspaceSlug: string,
	projectSlug: string,
) => {
	return `/organizations/${organizationSlug}/workspaces/${workspaceSlug}/projects/${projectSlug}/issues`;
};

export const createIssue = (
	organizationSlug: string,
	workspaceSlug: string,
	projectSlug: string,
	data: CreateIssueProps,
) => {
	return api.post(
		getIssueBasePath(organizationSlug, workspaceSlug, projectSlug),
		data,
	);
};

export const getIssues = (
	organizationSlug: string,
	workspaceSlug: string,
	projectSlug: string,
) => {
	return api.get(
		getIssueBasePath(organizationSlug, workspaceSlug, projectSlug)
	);
};

export const getIssue = (
	organizationSlug: string,
	worksapceSlug: string,
	projectSlug: string,
	issueId: string,
) => {
	return api.get(
		`${getIssueBasePath(organizationSlug, worksapceSlug, projectSlug)}/${issueId}`,
	);
};

export const updateIssue = (
	organizationSlug: string,
	worksapceSlug: string,
	projectSlug: string,
	issueId: string,
	data: UpdateIssueProps,
) => {
	return api.patch(
		`${getIssueBasePath(organizationSlug, worksapceSlug, projectSlug)}/${issueId}`,
		data,
	);
};

export const moveIssue = (
	organizationSlug: string,
	worksapceSlug: string,
	projectSlug: string,
	issueId: string,
	data: MoveIssueProps,
) => {
	return api.patch(
		`${getIssueBasePath(organizationSlug, worksapceSlug, projectSlug)}/${issueId}/move`,
		data,
	);
};

export const archiveIssue = (
	organizationSlug: string,
	worksapceSlug: string,
	projectSlug: string,
	issueId: string,
) => {
	return api.delete(
		`${getIssueBasePath(organizationSlug, worksapceSlug, projectSlug)}/${issueId}`,
	);
};
