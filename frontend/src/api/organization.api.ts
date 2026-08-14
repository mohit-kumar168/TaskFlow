import { api } from "./axios";

export interface OrganizationProps {
  id: string;
  name: string;
  description?: string;
  slug: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrganizationData {
  name: string;
  description?: string;
  logoUrl?: string;
}

export interface OrganizationMemberProps {
  id: string;
  organizationId: string;
  userId: string;
  role: "OWNER" | "ADMIN" | "MEMBER";
  status: "ACTIVE" | "INACTIVE" | "REMOVED";
  joinedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
  };
}

export interface InviteOrganizationMemberProps {
  email: string;
  role?: "ADMIN" | "MEMBER";
}

export const getOrganizations = () => {
  return api.get("/organizations");
};

export const getOrganization = (organizationSlug: string) => {
  return api.get(`/organizations/${organizationSlug}`);
};

export const createOrganization = (data: CreateOrganizationData) => {
  return api.post("/organizations", data);
};

export const updateOrganization = (
  organizationSlug: string,
  data: { name?: string; description?: string; logoUrl?: string },
) => {
  return api.patch(`/organizations/${organizationSlug}`, data);
};

export const archiveOrganization = (organizationSlug: string) => {
  return api.delete(`/organizations/${organizationSlug}`);
};

export const getOrganizationMembers = (organizationSlug: string) => {
  return api.get(`/organizations/${organizationSlug}/members`);
};

export const inviteOrganizationMember = (
  organizationSlug: string,
  data: InviteOrganizationMemberProps,
) => {
  return api.post(
    `/organizations/${organizationSlug}/invites`,
    data,
  );
};

export const acceptOrganizationInvite = (token: string) => {
  return api.post(
    `/organizations/invites/${token}/accept`
  );
};

export const updateOrganizationMemberRole = (
  organizationSlug: string,
  memberId: string,
  role: "ADMIN" | "MEMBER",
) => {
  return api.patch(
    `/organizations/${organizationSlug}/members/${memberId}`,
    { role },
  );
};

export const removeOrganizationMember = (
  organizationSlug: string,
  memberId: string,
) => {
  return api.delete(
    `/organizations/${organizationSlug}/members/${memberId}`,
  );
};