import type { OrganizationRole } from "@/generated/prisma/enums";

export interface CreateOrganizationInput {
	name: string;
	description?: string;
	logoUrl?: string;
}

export interface UpdateOrganizationInput {
	name?: string;
	description?: string;
	logoUrl?: string;
}

export interface CreateOrganizationInviteInput {
	email: string;
	role?: OrganizationRole;
}

export interface UpdateOrganizationMemberRoleInput {
	role: OrganizationRole;
}
