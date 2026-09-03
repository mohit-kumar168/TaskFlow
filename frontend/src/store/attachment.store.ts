import { create } from "zustand";

import {
  type AttachmentProps,
  uploadAttachment,
  fetchAllAttachments,
} from "@/api/attachment.api";

interface AttachmentStore {
  attachments: AttachmentProps[];
  isLoading: boolean;
  isUploading: boolean;
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

  clearAttachments: () => void;
}

const useAttachmentStore = create<AttachmentStore>((set) => ({
  attachments: [],
  isLoading: false,
  isUploading: false,
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

  clearAttachments: () => {
    set({
      attachments: [],
      isLoading: false,
      isUploading: false,
      error: null,
    });
  },
}));

export default useAttachmentStore;
