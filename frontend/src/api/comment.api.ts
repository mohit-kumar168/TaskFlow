import { api } from "./axios";

export interface CommentProps {
  id: string;
  issueId: string;
  authorId: string;
  content: string;
  createdAt: string;
  updatedAt: string;

  author: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
  };
}

export interface CommentContentProps {
  content: string;
}

const getCommentBaseUrl = (
  organizationSlug: string,
  workspaceSlug: string,
  projectSlug: string,
  issueId: string,
) => {
  return `/organizations/${organizationSlug}/workspaces/${workspaceSlug}/projects/${projectSlug}/issues/${issueId}/comments`;
};

export const createComment = async (
  organizationSlug: string,
  workspaceSlug: string,
  projectSlug: string,
  issueId: string,
  data: CommentContentProps,
) => {
  return api.post(
    `${getCommentBaseUrl(organizationSlug, workspaceSlug, projectSlug, issueId)}`,
    data,
  );
};

export const fetchAllComments = async (
  organizationSlug: string,
  workspaceSlug: string,
  projectSlug: string,
  issueId: string,
) => {
  return api.get(
    `${getCommentBaseUrl(organizationSlug, workspaceSlug, projectSlug, issueId)}`,
  );
};

export const fetchComment = async (
  organizationSlug: string,
  workspaceSlug: string,
  projectSlug: string,
  issueId: string,
  commentId: string,
) => {
  return api.get(
    `${getCommentBaseUrl(organizationSlug, workspaceSlug, projectSlug, issueId)}/${commentId}`,
  );
};

export const updateComment = async (
  organizationSlug: string,
  workspaceSlug: string,
  projectSlug: string,
  issueId: string,
  commentId: string,
  data: CommentContentProps,
) => {
  return api.patch(
    `${getCommentBaseUrl(organizationSlug, workspaceSlug, projectSlug, issueId)}/${commentId}`,
    data,
  );
};

export const deleteComment = async (
  organizationSlug: string,
  workspaceSlug: string,
  projectSlug: string,
  issueId: string,
  commentId: string,
) => {
  return api.delete(
    `${getCommentBaseUrl(organizationSlug, workspaceSlug, projectSlug, issueId)}/${commentId}`,
  );
};
