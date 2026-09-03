import apiError from "@/utils/apiError";

import * as attachmentRepository from "./attachment.repository";
import * as issueRepository from "@/modules/issues/issue.repository";
import * as projectRepository from "@/modules/projects/project.repository";
import * as workspaceRepository from "@/modules/workspaces/workspace.repository";
import * as organizationRepository from "@/modules/organization/organization.repository";
import { getProjectFolder, uploadToCloudinary } from "@/utils/cloudinary";

export const createAttachment = async (
  organizationSlug: string,
  workspaceSlug: string,
  projectSlug: string,
  userId: string,
  issueId: string,
  file: Express.Multer.File,
) => {
  if (!file) {
    throw new apiError(400, "Attachment file is required.");
  }

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

  const uploadResult = await uploadToCloudinary(
    file.buffer,
    {
      folder: `taskflow/projects/${project.slug}/issues/${issue.issueKey}`,
      resourceType: "auto",
    },
  );

  const attachment =
    await attachmentRepository.createAttachment(
      issue.id,
      userId,
      file.originalname,
      uploadResult.url,
      file.size,
      file.mimetype,
    );

  return attachment;
};

export const fetchAttachments = async (
  organizationSlug: string,
  workspaceSlug: string,
  projectSlug: string,
  userId: string,
  issueId: string,
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

  return await attachmentRepository.fetchAttachmentsByIssueId(
    issue.id,
  );
};
