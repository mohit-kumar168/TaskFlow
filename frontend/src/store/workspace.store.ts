import { create } from "zustand";

import {
	getWorkspace,
	getWorkspaceMembers,
	getWorkspaces,
	createWorkspace,
	updateWorkspace,
	archiveWorkspace,
	addWorkspaceMember,
	updateWorkspaceMemberRole,
	removeWorkspaceMember,
	type WorkspaceProps,
	type CreateWorkspaceProps,
	type AddWorkspaceMemberProps,
	type WorkspaceMemberProps,
} from "@/api/workspace.api";

interface WorkspaceStore {
	workspaces: WorkspaceProps[];
	currentWorkspace: WorkspaceProps | null;

	members: WorkspaceMemberProps[];

	isMembersLoading: boolean;
	isLoading: boolean;

	fetchWorkspaces: (organizationSlug: string) => Promise<void>;

	fetchWorkspace: (
		organizationSlug: string,
		workspaceSlug: string,
	) => Promise<void>;

	fetchWorkspaceMembers: (
		organizationSlug: string,
		workspaceSlug: string,
	) => Promise<void>;

	addWorkspaceMember: (
		organizationSlug: string,
		workspaceSlug: string,
		data: AddWorkspaceMemberProps,
	) => Promise<void>;

	updateWorkspaceMemberRole: (
		organizationSlug: string,
		workspaceSlug: string,
		memberId: string,
		role: "ADMIN" | "MEMBER",
	) => Promise<void>;

	removeWorkspaceMember: (
		organizationSlug: string,
		workspaceSlug: string,
		memberId: string,
	) => Promise<void>;

	createWorkspace: (
		organizationSlug: string,
		data: CreateWorkspaceProps,
	) => Promise<WorkspaceProps | null>;

	updateWorkspace: (
		organizationSlug: string,
		workspaceSlug: string,
		data: Partial<CreateWorkspaceProps>,
	) => Promise<WorkspaceProps | null>;

	archiveWorkspace: (
		organizationSlug: string,
		workspaceSlug: string,
	) => Promise<boolean>;
}

let workspaceRequestId = 0;

export const useWorkspaceStore = create<WorkspaceStore>((set, get) => ({
	workspaces: [],
	currentWorkspace: null,

	members: [],

	isMembersLoading: false,
	isLoading: false,

	fetchWorkspaces: async (organizationSlug) => {
		const requestId = ++workspaceRequestId;

		try {
			set({
				isLoading: true,
				workspaces: [],
				currentWorkspace: null,
			});

			const response = await getWorkspaces(organizationSlug);

			if (requestId !== workspaceRequestId) {
				return;
			}

			set({
				workspaces: response.data.data,
				isLoading: false,
			});
		} catch (error) {
			if (requestId !== workspaceRequestId) {
				return;
			}

			console.error("Failed to fetch workspaces:", error);

			set({
				workspaces: [],
				currentWorkspace: null,
				isLoading: false,
			});
		}
	},

	fetchWorkspace: async (organizationSlug, workspaceSlug) => {
		const requestId = ++workspaceRequestId;

		try {
			set({
				isLoading: true,
				currentWorkspace: null,
			});

			const response = await getWorkspace(organizationSlug, workspaceSlug);

			if (requestId !== workspaceRequestId) {
				return;
			}

			set({
				currentWorkspace: response.data.data,
				isLoading: false,
			});
		} catch (error) {
			if (requestId !== workspaceRequestId) {
				return;
			}

			console.error("Failed to fetch workspace:", error);

			set({
				currentWorkspace: null,
				isLoading: false,
			});
		}
	},

	fetchWorkspaceMembers: async (organizationSlug, workspaceSlug) => {
		try {
			set({
				isMembersLoading: true,
				members: [],
			});

			const response = await getWorkspaceMembers(
				organizationSlug,
				workspaceSlug,
			);

			set({
				members: response.data.data,
				isMembersLoading: false,
			});
		} catch (error) {
			console.error("Failed to fetch workspace members:", error);

			set({
				members: [],
				isMembersLoading: false,
			});
		}
	},

	addWorkspaceMember: async (organizationSlug, workspaceSlug, data) => {
		try {
			await addWorkspaceMember(organizationSlug, workspaceSlug, data);

			await get().fetchWorkspaceMembers(organizationSlug, workspaceSlug);
		} catch (error) {
			console.error("Failed to add workspace member:", error);

			throw error;
		}
	},

	updateWorkspaceMemberRole: async (
		organizationSlug,
		workspaceSlug,
		memberId,
		role,
	) => {
		try {
			const response = await updateWorkspaceMemberRole(
				organizationSlug,
				workspaceSlug,
				memberId,
				role,
			);

			const updatedMember = response.data.data;

			set((state) => ({
				members: state.members.map((member) =>
					member.id === updatedMember.id
						? {
							...member,
							role: updatedMember.role,
						}
						: member,
				),
			}));
		} catch (error) {
			console.error("Failed to update workspace member role:", error);

			throw error;
		}
	},

	removeWorkspaceMember: async (organizationSlug, workspaceSlug, memberId) => {
		try {
			await removeWorkspaceMember(organizationSlug, workspaceSlug, memberId);

			set((state) => ({
				members: state.members.filter((member) => member.id !== memberId),
			}));
		} catch (error) {
			console.error("Failed to remove workspace member:", error);

			throw error;
		}
	},

	createWorkspace: async (organizationSlug, data) => {
		try {
			set({
				isLoading: true,
			});

			const response = await createWorkspace(organizationSlug, data);

			const workspace = response.data.data;

			set((state) => ({
				workspaces: [...state.workspaces, workspace],
				currentWorkspace: workspace,
				isLoading: false,
			}));

			return workspace;
		} catch (error) {
			console.error("Failed to create workspace:", error);

			set({
				isLoading: false,
			});

			return null;
		}
	},

	updateWorkspace: async (
		organizationSlug,
		workspaceSlug,
		data,
	) => {
		try {
			set({
				isLoading: true,
			});

			const response = await updateWorkspace(
				organizationSlug,
				workspaceSlug,
				data,
			);

			const workspace = response.data.data;

			set((state) => ({
				workspaces: state.workspaces.map((item) =>
					item.id === workspace.id ? workspace : item,
				),
				currentWorkspace:
					state.currentWorkspace?.id === workspace.id
						? workspace
						: state.currentWorkspace,
				isLoading: false,
			}));

			return workspace;
		} catch (error) {
			console.error("Failed to update workspace:", error);

			set({
				isLoading: false,
			});

			return null;
		}
	},

	archiveWorkspace: async (
		organizationSlug,
		workspaceSlug,
	) => {
		try {
			set({
				isLoading: true,
			});

			await archiveWorkspace(
				organizationSlug,
				workspaceSlug,
			);

			set((state) => ({
				workspaces: state.workspaces.filter(
					(workspace) => workspace.slug !== workspaceSlug,
				),
				currentWorkspace:
					state.currentWorkspace?.slug === workspaceSlug
						? null
						: state.currentWorkspace,
				isLoading: false,
			}));

			return true;
		} catch (error) {
			console.error("Failed to archive workspace:", error);

			set({
				isLoading: false,
			});

			return false;
		}
	},

}));
