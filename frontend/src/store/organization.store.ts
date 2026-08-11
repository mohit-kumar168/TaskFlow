import { create } from "zustand";

import {
  getOrganization,
  getOrganizations,
  type OrganizationProps,
} from "@/api/organization.api";

interface OrganizationStore {
  organizations: OrganizationProps[];
  currentOrganization: OrganizationProps | null;
  isLoading: boolean;

  fetchOrganizations: () => Promise<void>;

  fetchOrganization: (organizationSlug: string) => Promise<void>;

  setCurrentOrganization: (organization: OrganizationProps) => void;
}

export const useOrganizationStore = create<OrganizationStore>((set) => ({
  organizations: [],
  currentOrganization: null,
  isLoading: false,

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

  setCurrentOrganization: (organization) => {
    set({
      currentOrganization: organization,
    });
  },
}));
