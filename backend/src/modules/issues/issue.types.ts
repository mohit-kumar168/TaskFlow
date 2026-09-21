import type { IssuePriority, IssueType } from "@/generated/prisma/enums";

export interface CreateIssueInput {
  title: string;
  description: string;
  priority?: IssuePriority;
  dueDate?: string;
  type?: IssueType;
  email?: string;
  columnId?: string;
  sprintId?: string;
}

export interface UpdateIssueInput {
  title?: string;
  description?: string;
  priority?: IssuePriority;
  dueDate?: string;
  type?: IssueType;
  email?: string;
  sprintId?: string | null;
}

export interface MoveIssueInput {
  columnId: string;
}

export interface PaginationQuery {
  page: number;
  limit: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
