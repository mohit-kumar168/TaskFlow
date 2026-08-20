import { create } from "zustand";

import {
	archiveIssue,
	createIssue,
	getIssue,
	getIssues,
	moveIssue,
	updateIssue,
	type CreateIssueProps,
	type IssueProps,
	type MoveIssueProps,
	type UpdateIssueProps,
} from "@/api/issue.api";

interface IssueStore {
	issues: IssueProps[];
	currentIssue: IssueProps | null;

	isLoading: boolean;
	isCreating: boolean;
	isUpdating: boolean;
	isMoving: boolean;
	isArchiving: boolean;

	fetchIssues: (
		organizationSlug: string,
		workspaceSlug: string,
		projectSlug: string,
	) => Promise<void>;

	fetchIssue: (
		organizationSlug: string,
		workspaceSlug: string,
		projectSlug: string,
		issueId: string,
	) => Promise<IssueProps | null>;

	createIssue: (
		organizationSlug: string,
		workspaceSlug: string,
		projectSlug: string,
		data: CreateIssueProps,
	) => Promise<IssueProps | null>;

	updateIssue: (
		organizationSlug: string,
		workspaceSlug: string,
		projectSlug: string,
		issueId: string,
		data: UpdateIssueProps,
	) => Promise<IssueProps | null>;

	moveIssue: (
		organizationSlug: string,
		workspaceSlug: string,
		projectSlug: string,
		issueId: string,
		data: MoveIssueProps,
	) => Promise<IssueProps | null>;

	archiveIssue: (
		organizationSlug: string,
		workspaceSlug: string,
		projectSlug: string,
		issueId: string,
	) => Promise<boolean>;

	setCurrentIssue: (issue: IssueProps | null) => void;
}

export const useIssueStore = create<IssueStore>((set) => ({
	issues: [],
	currentIssue: null,

	isLoading: false,
	isCreating: false,
	isUpdating: false,
	isMoving: false,
	isArchiving: false,

	fetchIssues: async (
		organizationSlug,
		workspaceSlug,
		projectSlug,
	) => {
		try {
			set({
				isLoading: true,
			});

			const response = await getIssues(
				organizationSlug,
				workspaceSlug,
				projectSlug,
			);

			set({
				issues: response.data.data,
				isLoading: false,
			});
		} catch (error) {
			console.error("Failed to fetch issues:", error);

			set({
				issues: [],
				isLoading: false,
			});
		}
	},

	fetchIssue: async (
		organizationSlug,
		workspaceSlug,
		projectSlug,
		issueId,
	) => {
		try {
			const response = await getIssue(
				organizationSlug,
				workspaceSlug,
				projectSlug,
				issueId,
			);

			const issue = response.data.data;

			set({
				currentIssue: issue,
			});

			return issue;
		} catch (error) {
			console.error("Failed to fetch issue:", error);

			set({
				currentIssue: null,
			});

			return null;
		}
	},

	createIssue: async (
		organizationSlug,
		workspaceSlug,
		projectSlug,
		data,
	) => {
		try {
			set({
				isCreating: true,
			});

			const response = await createIssue(
				organizationSlug,
				workspaceSlug,
				projectSlug,
				data,
			);

			const issue = response.data.data;

			set((state) => ({
				issues: [...state.issues, issue],
				isCreating: false,
			}));

			return issue;
		} catch (error) {
			console.error("Failed to create issue:", error);

			set({
				isCreating: false,
			});

			return null;
		}
	},

	updateIssue: async (
		organizationSlug,
		workspaceSlug,
		projectSlug,
		issueId,
		data,
	) => {
		try {
			set({
				isUpdating: true,
			});

			const response = await updateIssue(
				organizationSlug,
				workspaceSlug,
				projectSlug,
				issueId,
				data,
			);

			const updatedIssue = response.data.data;

			set((state) => ({
				issues: state.issues.map((issue) =>
					issue.id === updatedIssue.id
						? updatedIssue
						: issue,
				),

				currentIssue:
					state.currentIssue?.id === updatedIssue.id
						? updatedIssue
						: state.currentIssue,

				isUpdating: false,
			}));

			return updatedIssue;
		} catch (error) {
			console.error("Failed to update issue:", error);

			set({
				isUpdating: false,
			});

			return null;
		}
	},

	moveIssue: async (
		organizationSlug,
		workspaceSlug,
		projectSlug,
		issueId,
		data,
	) => {
		try {
			set({
				isMoving: true,
			});

			const response = await moveIssue(
				organizationSlug,
				workspaceSlug,
				projectSlug,
				issueId,
				data,
			);

			const movedIssue = response.data.data;

			set((state) => ({
				issues: state.issues.map((issue) =>
					issue.id === movedIssue.id
						? movedIssue
						: issue,
				),

				currentIssue:
					state.currentIssue?.id === movedIssue.id
						? movedIssue
						: state.currentIssue,

				isMoving: false,
			}));

			return movedIssue;
		} catch (error) {
			console.error("Failed to move issue:", error);

			set({
				isMoving: false,
			});

			return null;
		}
	},

	archiveIssue: async (
		organizationSlug,
		workspaceSlug,
		projectSlug,
		issueId,
	) => {
		try {
			set({
				isArchiving: true,
			});

			await archiveIssue(
				organizationSlug,
				workspaceSlug,
				projectSlug,
				issueId,
			);

			set((state) => ({
				issues: state.issues.filter(
					(issue) => issue.id !== issueId,
				),

				currentIssue:
					state.currentIssue?.id === issueId
						? null
						: state.currentIssue,

				isArchiving: false,
			}));

			return true;
		} catch (error) {
			console.error("Failed to archive issue:", error);

			set({
				isArchiving: false,
			});

			return false;
		}
	},

	setCurrentIssue: (issue) => {
		set({
			currentIssue: issue,
		});
	},
}));
