import { create } from "zustand";

import {
  createComment,
  fetchAllComments,
  updateComment,
  deleteComment,
  type CommentProps,
  type CommentContentProps,
} from "@/api/comment.api";

interface CommentStore {
  comments: CommentProps[];

  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;

  fetchComments: (
    organizationSlug: string,
    workspaceSlug: string,
    projectSlug: string,
    issueId: string,
  ) => Promise<void>;

  addComment: (
    organizationSlug: string,
    workspaceSlug: string,
    projectSlug: string,
    issueId: string,
    data: CommentContentProps,
  ) => Promise<CommentProps | null>;

  editComment: (
    organizationSlug: string,
    workspaceSlug: string,
    projectSlug: string,
    issueId: string,
    commentId: string,
    data: CommentContentProps,
  ) => Promise<CommentProps | null>;

  removeComment: (
    organizationSlug: string,
    workspaceSlug: string,
    projectSlug: string,
    issueId: string,
    commentId: string,
  ) => Promise<boolean>;

  clearComments: () => void;
}

export const useCommentStore = create<CommentStore>(
  (set) => ({
    comments: [],

    isLoading: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,

    fetchComments: async (
      organizationSlug,
      workspaceSlug,
      projectSlug,
      issueId,
    ) => {
      try {
        set({ isLoading: true });

        const response = await fetchAllComments(
          organizationSlug,
          workspaceSlug,
          projectSlug,
          issueId,
        );

        set({
          comments: response.data.data,
        });
      } finally {
        set({ isLoading: false });
      }
    },

    addComment: async (
      organizationSlug,
      workspaceSlug,
      projectSlug,
      issueId,
      data,
    ) => {
      try {
        set({ isCreating: true });

        const response = await createComment(
          organizationSlug,
          workspaceSlug,
          projectSlug,
          issueId,
          data,
        );

        const comment = response.data.data;

        set((state) => ({
          comments: [
            ...state.comments,
            comment,
          ],
        }));

        return comment;
      } finally {
        set({ isCreating: false });
      }
    },

    editComment: async (
      organizationSlug,
      workspaceSlug,
      projectSlug,
      issueId,
      commentId,
      data,
    ) => {
      try {
        set({ isUpdating: true });

        const response = await updateComment(
          organizationSlug,
          workspaceSlug,
          projectSlug,
          issueId,
          commentId,
          data,
        );

        const updatedComment = response.data.data;

        set((state) => ({
          comments: state.comments.map(
            (comment) =>
              comment.id === commentId
                ? {
                  ...comment,
                  ...updatedComment,
                }
                : comment,
          ),
        }));

        return updatedComment;
      } finally {
        set({ isUpdating: false });
      }
    },

    removeComment: async (
      organizationSlug,
      workspaceSlug,
      projectSlug,
      issueId,
      commentId,
    ) => {
      try {
        set({ isDeleting: true });

        await deleteComment(
          organizationSlug,
          workspaceSlug,
          projectSlug,
          issueId,
          commentId,
        );

        set((state) => ({
          comments: state.comments.filter(
            (comment) =>
              comment.id !== commentId,
          ),
        }));

        return true;
      } catch {
        return false;
      } finally {
        set({ isDeleting: false });
      }
    },

    clearComments: () => {
      set({ comments: [] });
    },
  }),
);
