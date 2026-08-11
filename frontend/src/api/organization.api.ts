import { api } from "./axios";

export interface OrganizationProps {
	id: string;
	name: string;
	slug: string;
	plan: string;
	ownerId: string;
	createdAt: string;
	updatedAt: string;
}

export const getOrganizations = () => {
	return api.get("/organizations");
};

export const getOrganization = (organizationSlug: string) => {
	return api.get(`/organizations/${organizationSlug}`);
};

export const createOrganization = (data: { name: string }) => {
	return api.post("/organizations", data);
};

export const updateOrganization = (organizationSlug: string, data: { name?: string; plan?: string }) => {
	return api.patch(`/organizations/${organizationSlug}`, data);
};

export const archiveOrganization = (organizationSlug: string) => {
	return api.delete(`/organizations/${organizationSlug}`);
};