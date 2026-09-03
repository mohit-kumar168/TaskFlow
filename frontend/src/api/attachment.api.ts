import { api } from "./axios";

export interface AttachmentProps {
  id: string;
  issueId: string;
  uploadedById: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  createdAt: string;

  uploadedBy: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
  };
}

const getAttachmentBaseUrl = (
  organizationSlug: string,
  workspaceSlug: string,
  projectSlug: string,
  issueId: string,
) => {
  return `/organizations/${organizationSlug}/workspaces/${workspaceSlug}/projects/${projectSlug}/issues/${issueId}/attachments`;
};

export const uploadAttachment = async (
  organizationSlug: string,
  workspaceSlug: string,
  projectSlug: string,
  issueId: string,
  file: File,
) => {
  const formData = new FormData();

  formData.append("file", file);

  return api.post(
    `${getAttachmentBaseUrl(
      organizationSlug,
      workspaceSlug,
      projectSlug,
      issueId,
    )}`,
    formData,
  );
};

export const fetchAllAttachments = async (
  organizationSlug: string,
  workspaceSlug: string,
  projectSlug: string,
  issueId: string,
) => {
  return api.get(
    `${getAttachmentBaseUrl(
      organizationSlug,
      workspaceSlug,
      projectSlug,
      issueId,
    )}`,
  );
};
