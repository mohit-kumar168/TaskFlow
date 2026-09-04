import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

import {
  type IssueProps,
  type IssueType,
  type IssuePriority,
  type UpdateIssueProps,
} from "@/api/issue.api";

import {
  getAllSprints,
  type SprintProps,
} from "@/api/sprint.api";

import CommentSection from "./CommentSection";
import AttachmentSection from "./AttachmentSection";

interface IssueDetailsFormData {
  title: string;
  description: string;
  type: IssueType;
  priority: IssuePriority;
  dueDate: string;
  email: string;
  sprintId: string;
}

interface IssueDetailsModalProps {
  isOpen: boolean;
  issue: IssueProps | null;
  isSubmitting: boolean;
  isArchiving: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateIssueProps) => void;
  onRemove: () => void;
}

const IssueDetailsModal = ({
  isOpen,
  issue,
  isSubmitting,
  isArchiving,
  onClose,
  onSubmit,
  onRemove,
}: IssueDetailsModalProps) => {
  const {
    organizationSlug,
    workspaceSlug,
    projectSlug,
  } = useParams<{
    organizationSlug: string;
    workspaceSlug: string;
    projectSlug: string;
  }>();

  const [isEditing, setIsEditing] =
    useState(false);

  const [sprints, setSprints] = useState<
    SprintProps[]
  >([]);

  const [isSprintsLoading, setIsSprintsLoading] =
    useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IssueDetailsFormData>({
    defaultValues: {
      title: "",
      description: "",
      type: "TASK",
      priority: "MEDIUM",
      dueDate: "",
      email: "",
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

    const loadSprints = async () => {
      try {
        setIsSprintsLoading(true);

        const response =
          await getAllSprints(
            organizationSlug,
            workspaceSlug,
            projectSlug,
          );

        setSprints(
          response.data.data ?? [],
        );
      } catch (error) {
        console.error(
          "Failed to fetch sprints for issue modal:",
          error,
        );

        setSprints([]);
      } finally {
        setIsSprintsLoading(false);
      }
    };

    loadSprints();
  }, [
    isOpen,
    organizationSlug,
    workspaceSlug,
    projectSlug,
  ]);

  useEffect(() => {
    if (!issue) {
      return;
    }

    reset({
      title: issue.title,
      description: issue.description ?? "",
      type: issue.type,
      priority: issue.priority,
      dueDate: issue.dueDate
        ? issue.dueDate.split("T")[0]
        : "",
      email: "",
      sprintId: issue.sprintId ?? "",
    });

    setIsEditing(false);
  }, [issue, reset]);

  useEffect(() => {
    if (!isOpen) {
      setIsEditing(false);
    }
  }, [isOpen]);

  if (!isOpen || !issue) {
    return null;
  }

  const selectedSprint = sprints.find(
    (sprint) =>
      sprint.id === issue.sprintId,
  );

  const isDisabled =
    isSubmitting || isArchiving;

  const handleFormSubmit = (
    data: IssueDetailsFormData,
  ) => {
    onSubmit({
      title: data.title.trim(),
      description: data.description.trim(),
      type: data.type,
      priority: data.priority,
      dueDate: data.dueDate
        ? new Date(
          `${data.dueDate}T00:00:00.000Z`,
        ).toISOString()
        : undefined,
      email:
        data.email.trim() || undefined,
      sprintId:
        data.sprintId || undefined,
    });
  };

  const handleCancelEdit = () => {
    reset({
      title: issue.title,
      description: issue.description ?? "",
      type: issue.type,
      priority: issue.priority,
      dueDate: issue.dueDate
        ? issue.dueDate.split("T")[0]
        : "",
      email: "",
      sprintId: issue.sprintId ?? "",
    });

    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-2 sm:p-4">
      <div className="flex h-[calc(100vh-1rem)] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:h-[90vh]">
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-gray-200 px-4 py-4 sm:px-6">
          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-400">
              {issue.issueKey}
            </p>

            <h2 className="mt-1 truncate text-base font-semibold text-gray-900 sm:text-lg">
              {isEditing
                ? "Edit Issue"
                : issue.title}
            </h2>

            {!isEditing && (
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="rounded-md bg-gray-100 px-2 py-1 text-[11px] font-medium text-gray-600">
                  {issue.type}
                </span>

                <span className="rounded-md bg-orange-50 px-2 py-1 text-[11px] font-medium text-orange-600">
                  {issue.priority}
                </span>

                {selectedSprint && (
                  <span className="rounded-md bg-gray-100 px-2 py-1 text-[11px] font-medium text-gray-600">
                    {selectedSprint.name}
                  </span>
                )}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isDisabled}
            className="shrink-0 rounded-lg px-2 py-1 text-xl leading-none text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-2">
          {/* LEFT - ISSUE */}
          <div className="min-h-0 overflow-y-auto border-b border-gray-200 px-4 py-5 sm:px-6 md:border-b-0 md:border-r">
            {!isEditing ? (
              <div className="space-y-5">
                <section>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    Description
                  </p>

                  {issue.description ? (
                    <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-gray-700">
                      {issue.description}
                    </p>
                  ) : (
                    <p className="mt-2 text-sm italic text-gray-400">
                      No description provided.
                    </p>
                  )}
                </section>

                {/* Issue details */}
                <section className="rounded-xl border border-gray-200 bg-gray-50/50 p-4">
                  <div className="grid grid-cols-2 gap-x-5 gap-y-4">
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                        Type
                      </p>

                      <p className="mt-1 text-sm font-medium text-gray-800">
                        {issue.type}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                        Priority
                      </p>

                      <p className="mt-1 text-sm font-medium text-gray-800">
                        {issue.priority}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                        Status
                      </p>

                      <p className="mt-1 text-sm font-medium text-gray-800">
                        {issue.status}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                        Sprint
                      </p>

                      <p className="mt-1 truncate text-sm font-medium text-gray-800">
                        {selectedSprint?.name ??
                          "No Sprint"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                        Due Date
                      </p>

                      <p className="mt-1 text-sm font-medium text-gray-800">
                        {issue.dueDate
                          ? new Date(
                            issue.dueDate,
                          ).toLocaleDateString()
                          : "No due date"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                        Assignee
                      </p>

                      <p className="mt-1 truncate text-sm font-medium text-gray-800">
                        {issue.assignee?.name ??
                          "Unassigned"}
                      </p>
                    </div>
                  </div>
                </section>

                {/* Attachments */}
                <AttachmentSection
                  issueId={issue.id}
                />

                {/* Edit */}
                <div className="border-t border-gray-200 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      setIsEditing(true)
                    }
                    disabled={isDisabled}
                    className="flex w-full items-center justify-center gap-2"
                  >
                    <Pencil size={14} />
                    Edit Issue
                  </Button>
                </div>
              </div>
            ) : (
              /* EDIT FORM */
              <form
                onSubmit={handleSubmit(
                  handleFormSubmit,
                )}
                className="space-y-5"
              >
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    Editing
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {issue.issueKey}
                  </p>
                </div>

                <Input
                  id="title"
                  label="Title"
                  error={errors.title?.message}
                  {...register("title", {
                    required:
                      "Issue title is required.",
                    minLength: {
                      value: 2,
                      message:
                        "Issue title must be at least 2 characters.",
                    },
                  })}
                  disabled={isDisabled}
                />

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="description"
                    className="text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>

                  <textarea
                    id="description"
                    rows={5}
                    {...register("description")}
                    disabled={isDisabled}
                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200 disabled:bg-gray-50"
                    placeholder="Describe the issue..."
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Type */}
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
                      disabled={isDisabled}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200 disabled:bg-gray-50"
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

                  {/* Priority */}
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
                      disabled={isDisabled}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200 disabled:bg-gray-50"
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
                    {...register("sprintId")}
                    disabled={
                      isDisabled ||
                      isSprintsLoading
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200 disabled:bg-gray-50"
                  >
                    <option value="">
                      {isSprintsLoading
                        ? "Loading sprints..."
                        : "No Sprint"}
                    </option>

                    {sprints.map((sprint) => (
                      <option
                        key={sprint.id}
                        value={sprint.id}
                      >
                        {sprint.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Due date */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="dueDate"
                    className="text-sm font-medium text-gray-700"
                  >
                    Due Date
                  </label>

                  <input
                    id="dueDate"
                    type="date"
                    {...register("dueDate")}
                    disabled={isDisabled}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200 disabled:bg-gray-50"
                  />
                </div>

                {/* Assignee */}
                <Input
                  id="email"
                  type="email"
                  label="Assignee Email"
                  placeholder="member@example.com"
                  error={errors.email?.message}
                  {...register("email")}
                  disabled={isDisabled}
                />

                {/* Actions */}
                <div className="flex flex-col gap-2 border-t border-gray-200 pt-4 sm:flex-row">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={
                      handleCancelEdit
                    }
                    disabled={isDisabled}
                    className="flex-1"
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    variant="outline"
                    disabled={isDisabled}
                    className="flex-1"
                  >
                    {isSubmitting
                      ? "Saving..."
                      : "Save Changes"}
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* RIGHT - COMMENTS */}
          <div className="min-h-0 overflow-hidden px-4 py-5 sm:px-6">
            <CommentSection
              issueId={issue.id}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-t border-gray-200 px-4 py-3 sm:px-6">
          <Button
            type="button"
            variant="outline"
            onClick={onRemove}
            disabled={isDisabled}
            className="text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isArchiving
              ? "Removing..."
              : "Remove Issue"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isDisabled}
            className="text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IssueDetailsModal;
