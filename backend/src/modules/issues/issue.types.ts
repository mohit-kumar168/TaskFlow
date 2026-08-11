import type { IssuePriority, IssueType } from "@/generated/prisma/enums";

export interface CreateIssueInput {
	title: string;
	description: string;
	priority?: IssuePriority;
	dueDate?: string;
	type?: IssueType;
	email?: string;
	columnId?: string;
}

export interface UpdateIssueInput {
	title?: string;
	description?: string;
	priority?: IssuePriority;
	dueDate?: string;
	type?: IssueType;
	email?: string;
}

export interface MoveIssueInput {
	columnId: string;
}
