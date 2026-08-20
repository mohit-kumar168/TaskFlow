import { create } from "zustand";

import {
	getOrganization,
	getOrganizations,
	type OrganizationProps,
	type CreateOrganizationData,
	createOrganization,
	type OrganizationMemberProps,
	getOrganizationMembers,
	updateOrganization,
	archiveOrganization,
	inviteOrganizationMember,
	updateOrganizationMemberRole,
	removeOrganizationMember,
	type InviteOrganizationMemberProps,
} from "@/api/organization.api";

interface OrganizationStore {
	organizations: OrganizationProps[];
	currentOrganization: OrganizationProps | null;
	organizationMembers: OrganizationMemberProps[];

	isLoading: boolean;
	isMembersLoading: boolean;

	fetchOrganizations: () => Promise<void>;

	fetchOrganization: (organizationSlug: string) => Promise<void>;

	fetchOrganizationMembers: (organizationSlug: string) => Promise<void>;

	setCurrentOrganization: (organization: OrganizationProps) => void;

	createOrganization: (
		data: CreateOrganizationData,
	) => Promise<OrganizationProps | null>;

	updateOrganization: (
		organizationSlug: string,
		data: CreateOrganizationData,
	) => Promise<OrganizationProps | null>;

	archiveOrganization: (
		organizationSlug: string,
	) => Promise<boolean>;

	inviteOrganizationMember: (
		organizationSlug: string,
		data: InviteOrganizationMemberProps,
	) => Promise<string | null>;

	updateOrganizationMemberRole: (
		organizationSlug: string,
		memberId: string,
		role: "ADMIN" | "MEMBER",
	) => Promise<OrganizationMemberProps | null>;

	removeOrganizationMember: (
		organizationSlug: string,
		memberId: string,
	) => Promise<boolean>;
}

export const useOrganizationStore = create<OrganizationStore>((set) => ({
	organizations: [],
	currentOrganization: null,
	organizationMembers: [],

	isLoading: false,
	isMembersLoading: false,

	fetchOrganizations: async () => {
		try {
			set({ isLoading: true });

			console.log("Fetching organizations...");

			const response = await getOrganizations();

			console.log("Organization response:", response.data);

			const organizations = response.data.data;

			set({
				organizations,
				currentOrganization: organizations[0] ?? null,
				isLoading: false,
			});

			console.log("Current organization:", organizations[0]);
		} catch (error) {
			console.error("Failed to fetch organizations:", error);

			set({
				organizations: [],
				currentOrganization: null,
				isLoading: false,
			});
		}
	},

	fetchOrganization: async (organizationSlug) => {
		try {
			set({ isLoading: true });

			const response = await getOrganization(organizationSlug);

			set({
				currentOrganization: response.data.data,
				isLoading: false,
			});
		} catch (error) {
			console.error("Failed to fetch organization:", error);

			set({
				currentOrganization: null,
				isLoading: false,
			});
		}
	},

	fetchOrganizationMembers: async (organizationSlug) => {
		try {
			set({
				isMembersLoading: true,
			});

			const response = await getOrganizationMembers(organizationSlug);

			set({
				organizationMembers: response.data.data,
				isMembersLoading: false,
			});
		} catch (error) {
			console.error("Failed to fetch organization members:", error);

			set({
				organizationMembers: [],
				isMembersLoading: false,
			});
		}
	},

	setCurrentOrganization: (organization) => {
		set({
			currentOrganization: organization,
		});
	},

	createOrganization: async (data) => {
		try {
			set({ isLoading: true });

			const response = await createOrganization(data);
			const organization = response.data.data;

			set((state) => ({
				organizations: [...state.organizations, organization],
				currentOrganization: organization,
				isLoading: false,
			}));
			return organization;
		} catch (error) {
			console.error("Failed to create organization:", error);

			set({
				isLoading: false,
			});
			return null;
		}
	},

	updateOrganization: async (organizationSlug, data) => {
		try {
			set({ isLoading: true });

			const response = await updateOrganization(organizationSlug, data);

			const organization = response.data.data;

			set((state) => ({
				currentOrganization: organization,
				organizations: state.organizations.map((item) =>
					item.slug === organizationSlug ? organization : item,
				),
				isLoading: false,
			}));

			return organization;
		} catch (error) {
			console.error("Failed to update organization:", error);

			set({ isLoading: false });

			return null;
		}
	},

	archiveOrganization: async (organizationSlug) => {
		try {
			set({ isLoading: true });
			await archiveOrganization(organizationSlug);

			set((state) => {
				const organizations = state.organizations.filter(
					(organization) =>
						organization.slug !== organizationSlug
				);

				return {
					organizations,
					currentOrganization: state.currentOrganization?.slug === organizationSlug
						? organizations[0] ?? null
						: state.currentOrganization,
					isLoading: false,
				}
			});

			return true;

		} catch (error) {
			console.error("Failed to delete organization:", error);
			set({ isLoading: false });

			return false;
		}
	},

	inviteOrganizationMember: async (organizationSlug, data) => {
		try {
			const response = await inviteOrganizationMember(organizationSlug, data);

			return response.data.data.inviteUrl;
		} catch (error) {
			console.error("Failed to invite organization member:", error);

			return null;
		}
	},

	updateOrganizationMemberRole: async (organizationSlug, memberId, role) => {
		try {
			const response = await updateOrganizationMemberRole(
				organizationSlug,
				memberId,
				role,
			);

			const updatedMember = response.data.data.member;

			set((state) => ({
				organizationMembers: state.organizationMembers.map((member) =>
					member.id === updatedMember.id
						? {
							...member,
							role: updatedMember.role,
						}
						: member,
				),
			}));

			return updatedMember;
		} catch (error) {
			console.error("Failed to update organization member role:", error);

			return null;
		}
	},

	removeOrganizationMember: async (organizationSlug, memberId) => {
		try {
			await removeOrganizationMember(organizationSlug, memberId);

			set((state) => ({
				organizationMembers: state.organizationMembers.filter(
					(member) => member.id !== memberId,
				),
			}));

			return true;
		} catch (error) {
			console.error("Failed to remove organization member:", error);

			return false;
		}
	},
}));
