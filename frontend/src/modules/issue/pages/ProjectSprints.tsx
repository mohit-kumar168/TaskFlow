import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useParams } from "react-router-dom";

import FeedbackModal from "@/components/ui/FeedBackModal";

import CreateSprintModal from "../components/CreateSprintModal";
import SprintSidebar from "../components/SprintSidebar";
import SprintIssuePanel from "../components/SprintIssuePanel";
import IssueDetailsModal from "../../issue/components/IssueDetailsModal";

import { type IssueProps, type UpdateIssueProps } from "@/api/issue.api";
import { useIssueStore } from "@/store/issue.store";
import { useSprintStore } from "../../../store/sprint.store";

const ProjectSprints = () => {
  const {
    organizationSlug,
    workspaceSlug,
    projectSlug,
  } = useParams<{
    organizationSlug: string;
    workspaceSlug: string;
    projectSlug: string;
  }>();

  const {
    sprints,
    currentSprint,
    sprintIssues,
    isLoading,
    isStarting,
    isCompleting,
    isFetchingIssues,
    fetchSprints,
    fetchSprintIssues,
    startSprint,
    completeSprint,
    setCurrentSprint,
  } = useSprintStore();

  const {
    updateIssue,
    archiveIssue,
    isArchiving,
  } = useIssueStore();

  const [isCreateModalOpen, setIsCreateModalOpen] =
    useState(false);

  const [selectedIssue, setSelectedIssue] =
    useState<IssueProps | null>(null);

  const [isIssueModalOpen, setIsIssueModalOpen] =
    useState(false);

  const [isUpdatingIssue, setIsUpdatingIssue] =
    useState(false);

  const [feedback, setFeedback] = useState<{
    isOpen: boolean;
    type: "success" | "error";
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });

  useEffect(() => {
    if (
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
    organizationSlug,
    workspaceSlug,
    projectSlug,
    fetchSprints,
  ]);

  useEffect(() => {
    if (
      !organizationSlug ||
      !workspaceSlug ||
      !projectSlug ||
      !currentSprint
    ) {
      return;
    }

    fetchSprintIssues(
      organizationSlug,
      workspaceSlug,
      projectSlug,
      currentSprint.id,
    );
  }, [
    organizationSlug,
    workspaceSlug,
    projectSlug,
    currentSprint,
    fetchSprintIssues,
  ]);

  const showSuccess = (
    title: string,
    message: string,
  ) => {
    setFeedback({
      isOpen: true,
      type: "success",
      title,
      message,
    });
  };

  const showError = (
    title: string,
    message: string,
  ) => {
    setFeedback({
      isOpen: true,
      type: "error",
      title,
      message,
    });
  };

  const handleStartSprint = async () => {
    if (
      !organizationSlug ||
      !workspaceSlug ||
      !projectSlug ||
      !currentSprint
    ) {
      return;
    }

    const sprint = await startSprint(
      organizationSlug,
      workspaceSlug,
      projectSlug,
      currentSprint.id,
    );

    if (!sprint) {
      showError(
        "Unable to start sprint",
        "Something went wrong while starting the sprint.",
      );
      return;
    }

    showSuccess(
      "Sprint started",
      "The sprint has been started successfully.",
    );

    await fetchSprintIssues(
      organizationSlug,
      workspaceSlug,
      projectSlug,
      currentSprint.id,
    );
  };

  const handleCompleteSprint = async () => {
    if (
      !organizationSlug ||
      !workspaceSlug ||
      !projectSlug ||
      !currentSprint
    ) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to complete this sprint? Incomplete issues will be moved to the backlog.",
    );

    if (!confirmed) {
      return;
    }

    const sprint = await completeSprint(
      organizationSlug,
      workspaceSlug,
      projectSlug,
      currentSprint.id,
      {
        moveIncompleteTo: "BACKLOG",
      },
    );

    if (!sprint) {
      showError(
        "Unable to complete sprint",
        "Something went wrong while completing the sprint.",
      );
      return;
    }

    setCurrentSprint(sprint);

    showSuccess(
      "Sprint completed",
      "The sprint has been completed successfully.",
    );

    await fetchSprints(
      organizationSlug,
      workspaceSlug,
      projectSlug,
    );

    await fetchSprintIssues(
      organizationSlug,
      workspaceSlug,
      projectSlug,
      sprint.id,
    );
  };

  const handleUpdateIssue = async (
    data: UpdateIssueProps,
  ) => {
    if (
      !organizationSlug ||
      !workspaceSlug ||
      !projectSlug ||
      !selectedIssue
    ) {
      return;
    }

    try {
      setIsUpdatingIssue(true);

      const updatedIssue = await updateIssue(
        organizationSlug,
        workspaceSlug,
        projectSlug,
        selectedIssue.id,
        data,
      );

      if (!updatedIssue) {
        showError(
          "Unable to update issue",
          "Something went wrong while updating the issue.",
        );
        return;
      }

      setIsIssueModalOpen(false);
      setSelectedIssue(null);

      if (currentSprint) {
        await fetchSprintIssues(
          organizationSlug,
          workspaceSlug,
          projectSlug,
          currentSprint.id,
        );
      }
    } finally {
      setIsUpdatingIssue(false);
    }
  };

  const handleRemoveIssue = async () => {
    if (
      !organizationSlug ||
      !workspaceSlug ||
      !projectSlug ||
      !selectedIssue
    ) {
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
      selectedIssue.id,
    );

    if (!success) {
      showError(
        "Unable to remove issue",
        "Something went wrong while removing the issue.",
      );
      return;
    }

    setIsIssueModalOpen(false);
    setSelectedIssue(null);

    if (currentSprint) {
      await fetchSprintIssues(
        organizationSlug,
        workspaceSlug,
        projectSlug,
        currentSprint.id,
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-100 items-center justify-center p-6">
        <p className="text-sm text-gray-500">
          Loading sprints...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Sprints
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Plan and manage work for this project.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-orange-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-orange-600"
        >
          <Plus size={16} />
          Create Sprint
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div>
          <SprintSidebar
            sprints={sprints}
            currentSprintId={currentSprint?.id ?? null}
            onSelectSprint={(sprint) => setCurrentSprint(sprint)}
            onCreateSprint={() => setIsCreateModalOpen(true)}
          />
        </div>

        <div>
          <SprintIssuePanel
            currentSprint={currentSprint}
            sprintIssues={sprintIssues}
            isFetchingIssues={isFetchingIssues}
            isStarting={isStarting}
            isCompleting={isCompleting}
            onStartSprint={handleStartSprint}
            onCompleteSprint={handleCompleteSprint}
            onIssueClick={(issue) => {
              setSelectedIssue(issue);
              setIsIssueModalOpen(true);
            }}
          />
        </div>
      </div>

      {organizationSlug &&
        workspaceSlug &&
        projectSlug && (
          <CreateSprintModal
            isOpen={isCreateModalOpen}
            organizationSlug={organizationSlug}
            workspaceSlug={workspaceSlug}
            projectSlug={projectSlug}
            onClose={() => setIsCreateModalOpen(false)}
            onSuccess={(message) =>
              showSuccess("Sprint created", message)
            }
            onError={(message) =>
              showError("Unable to create sprint", message)
            }
          />
        )}

      <FeedbackModal
        isOpen={feedback.isOpen}
        type={feedback.type}
        title={feedback.title}
        message={feedback.message}
        onClose={() =>
          setFeedback((state) => ({
            ...state,
            isOpen: false,
          }))
        }
      />

      <IssueDetailsModal
        isOpen={isIssueModalOpen}
        issue={selectedIssue}
        isSubmitting={isUpdatingIssue}
        isArchiving={isArchiving}
        onClose={() => {
          setIsIssueModalOpen(false);
          setSelectedIssue(null);
        }}
        onSubmit={handleUpdateIssue}
        onRemove={handleRemoveIssue}
      />
    </div>
  );
};

export default ProjectSprints;
