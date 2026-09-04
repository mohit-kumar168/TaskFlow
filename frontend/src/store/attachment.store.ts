import { create } from "zustand";

import {
  type AttachmentProps,
  uploadAttachment,
  fetchAllAttachments,
  deleteAttachment,
} from "@/api/attachment.api";

interface AttachmentStore {
  attachments: AttachmentProps[];
  isLoading: boolean;
  isUploading: boolean;
  isDeleting: boolean;
  error: string | null;

  fetchAttachments: (
    organizationSlug: string,
    workspaceSlug: string,
    projectSlug: string,
    issueId: string,
  ) => Promise<void>;

  uploadAttachment: (
    organizationSlug: string,
    workspaceSlug: string,
    projectSlug: string,
    issueId: string,
    file: File,
  ) => Promise<void>;

  removeAttachment: (
    organizationSlug: string,
    workspaceSlug: string,
    projectSlug: string,
    issueId: string,
    attachmentId: string,
  ) => Promise<void>;

  clearAttachments: () => void;
}

const useAttachmentStore = create<AttachmentStore>((set) => ({
  attachments: [],
  isLoading: false,
  isUploading: false,
  isDeleting: false,
  error: null,

  fetchAttachments: async (
    organizationSlug,
    workspaceSlug,
    projectSlug,
    issueId,
  ) => {
    try {
      set({
        isLoading: true,
        error: null,
      });

      const response = await fetchAllAttachments(
        organizationSlug,
        workspaceSlug,
        projectSlug,
        issueId,
      );

      set({
        attachments: response.data.data,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error:
          error?.response?.data?.message ??
          "Failed to fetch attachments.",
      });
    }
  },

  uploadAttachment: async (
    organizationSlug,
    workspaceSlug,
    projectSlug,
    issueId,
    file,
  ) => {
    try {
      set({
        isUploading: true,
        error: null,
      });

      const response = await uploadAttachment(
        organizationSlug,
        workspaceSlug,
        projectSlug,
        issueId,
        file,
      );

      set((state) => ({
        attachments: [
          response.data.data,
          ...state.attachments,
        ],
        isUploading: false,
      }));
    } catch (error: any) {
      set({
        isUploading: false,
        error:
          error?.response?.data?.message ??
          "Failed to upload attachment.",
      });

      throw error;
    }
  },

  removeAttachment: async (
    organizationSlug,
    workspaceSlug,
    projectSlug,
    issueId,
    attachmentId,
  ) => {
    try {
      set({
        isDeleting: true,
        error: null,
      });

      await deleteAttachment(
        organizationSlug,
        workspaceSlug,
        projectSlug,
        issueId,
        attachmentId,
      );

      set((state) => ({
        attachments: state.attachments.filter(
          (attachment) =>
            attachment.id !== attachmentId,
        ),
        isDeleting: false,
      }));
    } catch (error: any) {
      set({
        isDeleting: false,
        error:
          error?.response?.data?.message ??
          "Failed to remove attachment.",
      });

      throw error;
    }
  },

  clearAttachments: () => {
    set({
      attachments: [],
      isLoading: false,
      isUploading: false,
      isDeleting: false,
      error: null,
    });
  },
}));

export default useAttachmentStore;
