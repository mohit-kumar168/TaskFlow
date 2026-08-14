import { api } from "./axios";

export interface WorkspaceProps {
  id: string;
  name: string;
  slug: string;
  description: string;
  logoUrl: string | null;
  ownerId: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;

  _count?: {
    members: number;
    projects: number;
  };
}

export interface WorkspaceMemberProps {
  id: string;
  workspaceId: string;
  userId: string;
  role: "OWNER" | "ADMIN" | "MEMBER";
  status: "ACTIVE" | "INACTIVE";
  joinedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string | null;
  };
}

export interface CreateWorkspaceProps {
  name: string;
  description: string;
  logoUrl?: string;
}

export interface AddWorkspaceMemberProps {
  email: string;
  role?: "ADMIN" | "MEMBER";
}

export const createWorkspace = (
  organizationSlug: string,
  data: CreateWorkspaceProps,
) => {
  return api.post(`/organizations/${organizationSlug}/workspaces`, data);
};

export const getWorkspaces = (organizationSlug: string) => {
  return api.get(`/organizations/${organizationSlug}/workspaces`);
};

export const getWorkspace = (
  organizationSlug: string,
  workspaceSlug: string,
) => {
  return api.get(
    `/organizations/${organizationSlug}/workspaces/${workspaceSlug}`,
  );
};

export const addWorkspaceMember = (
  organizationSlug: string,
  workspaceSlug: string,
  data: AddWorkspaceMemberProps,
) => {
  return api.post(
    `/organizations/${organizationSlug}/workspaces/${workspaceSlug}/members`,
    data,
  );
};

export const getWorkspaceMembers = (
  organizationSlug: string,
  workspaceSlug: string,
) => {
  return api.get(
    `/organizations/${organizationSlug}/workspaces/${workspaceSlug}/members`,
  );
};

export const updateWorkspaceMemberRole = (
  organizationSlug: string,
  workspaceSlug: string,
  memberId: string,
  role: "ADMIN" | "MEMBER",
) => {
  return api.patch(
    `/organizations/${organizationSlug}/workspaces/${workspaceSlug}/members/${memberId}`,
    { role },
  );
};

export const removeWorkspaceMember = (
  organizationSlug: string,
  workspaceSlug: string,
  memberId: string,
) => {
  return api.delete(
    `/organizations/${organizationSlug}/workspaces/${workspaceSlug}/members/${memberId}`,
  );
};
