import apiError from "@/utils/apiError";
import * as commentRepository from "./comment.repository";
import * as issueRepository from "../issues/issue.repository";
import * as projectRepository from "../projects/project.repository";
import * as workspaceRepository from "../workspaces/workspace.repository";
import * as organizationRepository from "../organization/organization.repository";

import type {
  CommentInput,
} from "./comment.types";

export const createComment = async (
  organizationSlug: string,
  workspaceSlug: string,
  projectSlug: string,
  issueId: string,
  userId: string,
  data: CommentInput,
) => {
  const organization =
    await organizationRepository.findOrganizationBySlug(
      organizationSlug,
      userId,
    );

  if (!organization) {
    throw new apiError(404, "Organization not found.");
  }

  const workspace =
    await workspaceRepository.findWorkspaceBySlug(
      organization.id,
      workspaceSlug,
      userId,
    );

  if (!workspace) {
    throw new apiError(404, "Workspace not found.");
  }

  const project =
    await projectRepository.findProjectBySlug(
      workspace.id,
      userId,
      projectSlug,
    );

  if (!project) {
    throw new apiError(404, "Project not found.");
  }

  const projectMember =
    await projectRepository.findProjectMemberByUserId(
      project.id,
      userId,
    );

  if (!projectMember) {
    throw new apiError(
      403,
      "You don't have access to this project.",
    );
  }

  const issue =
    await issueRepository.fetchIssueById(
      project.id,
      issueId,
    );

  if (!issue) {
    throw new apiError(
      404,
      "Issue not found.",
    );
  }

  return await commentRepository.createComment(
    issue.id,
    userId,
    data,
  );
};

export const fetchAllComments = async (
  organizationSlug: string,
  workspaceSlug: string,
  projectSlug: string,
  issueId: string,
  userId: string,
) => {
  const organization =
    await organizationRepository.findOrganizationBySlug(
      organizationSlug,
      userId,
    );

  if (!organization) {
    throw new apiError(404, "Organization not found.");
  }

  const workspace =
    await workspaceRepository.findWorkspaceBySlug(
      organization.id,
      workspaceSlug,
      userId,
    );

  if (!workspace) {
    throw new apiError(404, "Workspace not found.");
  }

  const project =
    await projectRepository.findProjectBySlug(
      workspace.id,
      userId,
      projectSlug,
    );

  if (!project) {
    throw new apiError(404, "Project not found.");
  }

  const projectMember =
    await projectRepository.findProjectMemberByUserId(
      project.id,
      userId,
    );

  if (!projectMember) {
    throw new apiError(
      403,
      "You don't have access to this project.",
    );
  }

  const issue =
    await issueRepository.fetchIssueById(
      project.id,
      issueId,
    );

  if (!issue) {
    throw new apiError(
      404,
      "Issue not found.",
    );
  }

  return await commentRepository.fetchAllComments(
    issue.id,
  );
};

export const updateComment = async (
  organizationSlug: string,
  workspaceSlug: string,
  projectSlug: string,
  issueId: string,
  commentId: string,
  userId: string,
  data: CommentInput,
) => {
  const organization =
    await organizationRepository.findOrganizationBySlug(
      organizationSlug,
      userId,
    );

  if (!organization) {
    throw new apiError(404, "Organization not found.");
  }

  const workspace =
    await workspaceRepository.findWorkspaceBySlug(
      organization.id,
      workspaceSlug,
      userId,
    );

  if (!workspace) {
    throw new apiError(404, "Workspace not found.");
  }

  const project =
    await projectRepository.findProjectBySlug(
      workspace.id,
      userId,
      projectSlug,
    );

  if (!project) {
    throw new apiError(404, "Project not found.");
  }

  const projectMember =
    await projectRepository.findProjectMemberByUserId(
      project.id,
      userId,
    );

  if (!projectMember) {
    throw new apiError(
      403,
      "You don't have access to this project.",
    );
  }

  const issue =
    await issueRepository.fetchIssueById(
      project.id,
      issueId,
    );

  if (!issue) {
    throw new apiError(
      404,
      "Issue not found.",
    );
  }

  const comment =
    await commentRepository.fetchCommentById(
      issue.id,
      commentId,
    );

  if (!comment) {
    throw new apiError(
      404,
      "Comment not found.",
    );
  }

  if (comment.authorId !== userId) {
    throw new apiError(
      403,
      "You don't have permission to update this comment.",
    );
  }

  return await commentRepository.updateComment(
    comment.id,
    data,
  );
};

export const deleteComment = async (
  organizationSlug: string,
  workspaceSlug: string,
  projectSlug: string,
  issueId: string,
  commentId: string,
  userId: string,
) => {
  const organization =
    await organizationRepository.findOrganizationBySlug(
      organizationSlug,
      userId,
    );

  if (!organization) {
    throw new apiError(404, "Organization not found.");
  }

  const workspace =
    await workspaceRepository.findWorkspaceBySlug(
      organization.id,
      workspaceSlug,
      userId,
    );

  if (!workspace) {
    throw new apiError(404, "Workspace not found.");
  }

  const project =
    await projectRepository.findProjectBySlug(
      workspace.id,
      userId,
      projectSlug,
    );

  if (!project) {
    throw new apiError(404, "Project not found.");
  }

  const projectMember =
    await projectRepository.findProjectMemberByUserId(
      project.id,
      userId,
    );

  if (!projectMember) {
    throw new apiError(
      403,
      "You don't have access to this project.",
    );
  }

  const issue =
    await issueRepository.fetchIssueById(
      project.id,
      issueId,
    );

  if (!issue) {
    throw new apiError(
      404,
      "Issue not found.",
    );
  }

  const comment =
    await commentRepository.fetchCommentById(
      issue.id,
      commentId,
    );

  if (!comment) {
    throw new apiError(
      404,
      "Comment not found.",
    );
  }

  if (comment.authorId !== userId) {
    throw new apiError(
      403,
      "You don't have permission to delete this comment.",
    );
  }

  await commentRepository.deleteComment(
    comment.id,
  );
};
