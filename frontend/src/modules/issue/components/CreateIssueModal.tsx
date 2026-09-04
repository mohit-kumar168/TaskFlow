import { useEffect, useRef, useState } from "react";
import {
  File,
  FileImage,
  FileText,
  Paperclip,
  X,
} from "lucide-react";
import { useForm } from "react-hook-form";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

import {
  useIssueStore,
} from "@/store/issue.store";

import {
  useSprintStore,
} from "@/store/sprint.store";

import useAttachmentStore from "@/store/attachment.store";

type CreateIssueFormData = {
  title: string;
  description: string;
  type: "TASK" | "BUG" | "STORY" | "EPIC";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  email: string;
  dueDate: string;
  sprintId: string;
};

interface CreateIssueModalProps {
  isOpen: boolean;
  organizationSlug: string;
  workspaceSlug: string;
  projectSlug: string;
  onClose: () => void;
  onCreated?: () => void;
}

const getFileIcon = (mimeType: string) => {
  if (mimeType.startsWith("image/")) {
    return FileImage;
  }

  if (
    mimeType.includes("pdf") ||
    mimeType.includes("text") ||
    mimeType.includes("document")
  ) {
    return FileText;
  }

  return File;
};

const CreateIssueModal = ({
  isOpen,
  organizationSlug,
  workspaceSlug,
  projectSlug,
  onClose,
  onCreated,
}: CreateIssueModalProps) => {
  const {
    createIssue,
    isCreating,
  } = useIssueStore();

  const {
    sprints,
    fetchSprints,
    isLoading: isLoadingSprints,
  } = useSprintStore();

  const {
    uploadAttachment,
    isUploading,
    error: attachmentError,
  } = useAttachmentStore();

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateIssueFormData>({
    defaultValues: {
      title: "",
      description: "",
      type: "TASK",
      priority: "MEDIUM",
      email: "",
      dueDate: "",
      sprintId: "",
    },
  });

  useEffect(() => {
    if (
      !isOpen ||
      !organizationSlug ||
      !workspaceSlug ||
      !projectSlug
    ) {
      return;
    }

    fetchSprints(
      organizationSlug,
      workspaceSlug,
      projectSlug,
    );
  }, [
    isOpen,
    organizationSlug,
    workspaceSlug,
    projectSlug,
    fetchSprints,
  ]);

  if (!isOpen) {
    return null;
  }

  const isSubmitting =
    isCreating || isUploading;

  const handleFileSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setSelectedFile(file);

    event.target.value = "";
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  const handleCreateIssue = async (
    data: CreateIssueFormData,
  ) => {
    const issue = await createIssue(
      organizationSlug,
      workspaceSlug,
      projectSlug,
      {
        title: data.title.trim(),

        description:
          data.description.trim() ||
          undefined,

        type: data.type,

        priority: data.priority,

        email:
          data.email.trim() ||
          undefined,

        dueDate: data.dueDate
          ? new Date(
            `${data.dueDate}T00:00:00.000Z`,
          ).toISOString()
          : undefined,

        sprintId:
          data.sprintId ||
          undefined,
      },
    );

    if (!issue) {
      return;
    }

    /*
     * The issue must exist before we can upload
     * an attachment because the attachment endpoint
     * requires the issue ID.
     */
    if (selectedFile) {
      try {
        await uploadAttachment(
          organizationSlug,
          workspaceSlug,
          projectSlug,
          issue.id,
          selectedFile,
        );
      } catch (error) {
        /*
         * The issue has already been created.
         * Keep the issue, but don't close silently
         * if the attachment upload fails.
         */
        console.error(
          "Failed to upload issue attachment:",
          error,
        );

        return;
      }
    }

    reset();
    setSelectedFile(null);

    onClose();
    onCreated?.();
  };

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }

    reset();
    setSelectedFile(null);
    onClose();
  };

  const FileIcon = selectedFile
    ? getFileIcon(selectedFile.type)
    : File;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-3 py-4 sm:px-4">
      <div className="flex max-h-[95vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between border-b border-gray-200 px-5 py-4 sm:px-6 sm:py-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Create Issue
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Create a new issue for this project.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="rounded-lg px-2 py-1 text-xl text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(
            handleCreateIssue,
          )}
          className="min-h-0 overflow-y-auto space-y-5 px-5 py-5 sm:px-6 sm:py-6"
        >
          <Input
            id="title"
            label="Title"
            placeholder="Enter issue title"
            error={errors.title?.message}
            {...register("title", {
              required:
                "Issue title is required.",

              minLength: {
                value: 2,
                message:
                  "Issue title must be at least 2 characters.",
              },

              maxLength: {
                value: 100,
                message:
                  "Issue title cannot exceed 100 characters.",
              },
            })}
            disabled={isSubmitting}
          />

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="description"
              className="text-sm font-medium text-gray-700"
            >
              Description
            </label>

            <textarea
              id="description"
              rows={4}
              placeholder="Describe the issue..."
              {...register("description", {
                maxLength: {
                  value: 500,
                  message:
                    "Description cannot exceed 500 characters.",
                },
              })}
              disabled={isSubmitting}
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-200 disabled:bg-gray-50"
            />

            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Type + Priority */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="type"
                className="text-sm font-medium text-gray-700"
              >
                Type
              </label>

              <select
                id="type"
                {...register("type")}
                disabled={isSubmitting}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 disabled:bg-gray-50"
              >
                <option value="TASK">
                  Task
                </option>

                <option value="BUG">
                  Bug
                </option>

                <option value="STORY">
                  Story
                </option>

                <option value="EPIC">
                  Epic
                </option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="priority"
                className="text-sm font-medium text-gray-700"
              >
                Priority
              </label>

              <select
                id="priority"
                {...register("priority")}
                disabled={isSubmitting}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 disabled:bg-gray-50"
              >
                <option value="LOW">
                  Low
                </option>

                <option value="MEDIUM">
                  Medium
                </option>

                <option value="HIGH">
                  High
                </option>

                <option value="URGENT">
                  Urgent
                </option>
              </select>
            </div>
          </div>

          {/* Sprint */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="sprintId"
              className="text-sm font-medium text-gray-700"
            >
              Sprint
            </label>

            <select
              id="sprintId"
              disabled={
                isSubmitting ||
                isLoadingSprints
              }
              {...register("sprintId")}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 disabled:bg-gray-50"
            >
              <option value="">
                {isLoadingSprints
                  ? "Loading sprints..."
                  : "No Sprint"}
              </option>

              {sprints.map((sprint) => (
                <option
                  key={sprint.id}
                  value={sprint.id}
                >
                  {sprint.name} (
                  {sprint.status})
                </option>
              ))}
            </select>
          </div>

          {/* Assignee */}
          <Input
            id="email"
            label="Assignee Email"
            type="email"
            placeholder="Enter assignee email (optional)"
            error={errors.email?.message}
            {...register("email", {
              pattern: {
                value:
                  /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message:
                  "Enter a valid email address.",
              },
            })}
            disabled={isSubmitting}
          />

          {/* Due Date */}
          <Input
            id="dueDate"
            label="Due Date"
            type="date"
            error={errors.dueDate?.message}
            {...register("dueDate")}
            disabled={isSubmitting}
          />

          {/* Attachment */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Attachment
            </label>

            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileSelect}
              disabled={isSubmitting}
            />

            {!selectedFile ? (
              <button
                type="button"
                onClick={() =>
                  fileInputRef.current?.click()
                }
                disabled={isSubmitting}
                className="flex min-h-24 w-full flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 px-4 py-5 text-center transition hover:border-orange-400 hover:bg-orange-50/40 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Paperclip
                  size={20}
                  className="text-gray-400"
                />

                <span className="mt-2 text-sm font-medium text-gray-600">
                  Add an attachment
                </span>

                <span className="mt-1 text-xs text-gray-400">
                  Choose a file to attach to this issue
                </span>
              </button>
            ) : (
              <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-3 py-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white">
                  <FileIcon
                    size={18}
                    className="text-gray-500"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-800">
                    {selectedFile.name}
                  </p>

                  <p className="mt-0.5 text-xs text-gray-400">
                    {(
                      selectedFile.size /
                      1024 /
                      1024
                    ).toFixed(1)}{" "}
                    MB
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleRemoveFile}
                  disabled={isSubmitting}
                  className="rounded-lg p-2 text-gray-400 transition hover:bg-white hover:text-red-500 disabled:opacity-50"
                  aria-label="Remove attachment"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {attachmentError && (
              <p className="text-sm text-red-500">
                {attachmentError}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="w-full rounded-lg px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 sm:w-1/2"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-1/2"
            >
              {isCreating
                ? "Creating..."
                : isUploading
                  ? "Uploading..."
                  : "Create Issue"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateIssueModal;
