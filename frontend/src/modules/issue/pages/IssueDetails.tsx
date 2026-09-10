import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import type { UpdateIssueProps } from "@/api/issue.api";
import {
  getAllSprints,
  type SprintProps,
} from "@/api/sprint.api";
import Button from "@/modules/common/components/ui/Button";
import { useIssueStore } from "@/store/issue.store";

import CommentSection from "../components/CommentSection";
import IssueEditForm, {
  type IssueDetailsFormData,
} from "../components/IssueEditForm";
import IssueHeader from "../components/IssueHeader";
import IssueOverview from "../components/IssueOverview";

const IssueDetails = () => {
  const navigate = useNavigate();
  const {
    organizationSlug,
    workspaceSlug,
    projectSlug,
    issueId,
  } = useParams<{
    organizationSlug: string;
    workspaceSlug: string;
    projectSlug: string;
    issueId: string;
  }>();
  const {
    currentIssue,
    fetchIssue,
    updateIssue,
    archiveIssue,
    setCurrentIssue,
    isLoading,
    isUpdating,
    isArchiving,
  } = useIssueStore();

  const [isEditing, setIsEditing] = useState(false);
  const [sprints, setSprints] = useState<SprintProps[]>([]);
  const [isSprintsLoading, setIsSprintsLoading] = useState(false);
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
    if (!organizationSlug || !workspaceSlug || !projectSlug || !issueId) {
      return;
    }

    setCurrentIssue(null);
    fetchIssue(
      organizationSlug,
      workspaceSlug,
      projectSlug,
      issueId,
    );
  }, [
    organizationSlug,
    workspaceSlug,
    projectSlug,
    issueId,
    fetchIssue,
    setCurrentIssue,
  ]);

  useEffect(() => {
    if (!organizationSlug || !workspaceSlug || !projectSlug) {
      return;
    }

    const loadSprints = async () => {
      try {
        setIsSprintsLoading(true);
        const response = await getAllSprints(
          organizationSlug,
          workspaceSlug,
          projectSlug,
        );
        setSprints(response.data.data ?? []);
      } catch (error) {
        console.error("Failed to fetch sprints:", error);
        setSprints([]);
      } finally {
        setIsSprintsLoading(false);
      }
    };

    loadSprints();
  }, [organizationSlug, workspaceSlug, projectSlug]);

  useEffect(() => {
    if (!currentIssue) {
      return;
    }

    reset(getFormValues(currentIssue));
    setIsEditing(false);
  }, [currentIssue, reset]);

  const handleFormSubmit = async (data: IssueDetailsFormData) => {
    if (!organizationSlug || !workspaceSlug || !projectSlug || !issueId) {
      return;
    }

    const updateData: UpdateIssueProps = {
      title: data.title.trim(),
      description: data.description.trim(),
      type: data.type,
      priority: data.priority,
      dueDate: data.dueDate
        ? new Date(`${data.dueDate}T00:00:00.000Z`).toISOString()
        : undefined,
      email: data.email.trim() || undefined,
      sprintId: data.sprintId || undefined,
    };
    const updatedIssue = await updateIssue(
      organizationSlug,
      workspaceSlug,
      projectSlug,
      issueId,
      updateData,
    );

    if (!updatedIssue) {
      return;
    }

    setIsEditing(false);
    reset(getFormValues(updatedIssue));
  };

  const handleCancelEdit = () => {
    if (!currentIssue) {
      return;
    }

    reset(getFormValues(currentIssue));
    setIsEditing(false);
  };

  const handleRemoveIssue = async () => {
    if (!organizationSlug || !workspaceSlug || !projectSlug || !issueId) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to remove this issue?",
    );
    if (!confirmed) {
      return;
    }

    const success = await archiveIssue(
      organizationSlug,
      workspaceSlug,
      projectSlug,
      issueId,
    );
    if (success) {
      navigate(-1);
    }
  };

  if (isLoading && !currentIssue) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center p-6">
        <p className="text-sm text-gray-500">Loading issue...</p>
      </div>
    );
  }

  if (!currentIssue) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <p className="text-sm font-medium text-gray-700">
            Issue not found.
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            className="mt-4"
          >
            <ArrowLeft size={14} />
            Back
          </Button>
        </div>
      </div>
    );
  }

  const selectedSprint = sprints.find(
    (sprint) => sprint.id === currentIssue.sprintId,
  );
  const isDisabled = isUpdating || isArchiving;

  return (
    <div className="min-h-full bg-gray-50 p-4 sm:p-6">
      <button
        type="button"
        onClick={() => navigate(-1)}
        disabled={isDisabled}
        className="mb-4 flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-gray-500 transition hover:bg-white hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <div className="mx-auto max-w-7xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <IssueHeader
          issue={currentIssue}
          selectedSprint={selectedSprint}
          isEditing={isEditing}
          isDisabled={isDisabled}
          onEdit={() => setIsEditing(true)}
        />

        <div className="grid min-h-0 grid-cols-1 lg:grid-cols-2">
          <div className="min-w-0 border-b border-gray-200 p-5 sm:p-6 lg:border-b-0 lg:border-r">
            {!isEditing ? (
              <IssueOverview
                issue={currentIssue}
                selectedSprint={selectedSprint}
                isDisabled={isDisabled}
                isArchiving={isArchiving}
                onRemove={handleRemoveIssue}
              />
            ) : (
              <IssueEditForm
                issueKey={currentIssue.issueKey}
                register={register}
                handleSubmit={handleSubmit}
                errors={errors}
                onSubmit={handleFormSubmit}
                onCancel={handleCancelEdit}
                sprints={sprints}
                isSprintsLoading={isSprintsLoading}
                isDisabled={isDisabled}
                isUpdating={isUpdating}
              />
            )}
          </div>

          <div className="min-h-0 p-5 sm:p-6">
            <CommentSection issueId={currentIssue.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

const getFormValues = (issue: {
  title: string;
  description: string | null;
  type: IssueDetailsFormData["type"];
  priority: IssueDetailsFormData["priority"];
  dueDate: string | null;
  sprintId: string | null;
}): IssueDetailsFormData => ({
  title: issue.title,
  description: issue.description ?? "",
  type: issue.type,
  priority: issue.priority,
  dueDate: issue.dueDate ? issue.dueDate.slice(0, 10) : "",
  email: "",
  sprintId: issue.sprintId ?? "",
});

export default IssueDetails;
