import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { useProjectStore } from "@/store/project.store";
import { useIssueStore } from "@/store/issue.store";

import IssueCard from "@/modules/issue/components/IssueCard";
import CreateIssueModal from "@/modules/issue/components/CreateIssueModal";

const ProjectBoard = () => {
  const navigate = useNavigate();

  const [isCreateIssueModalOpen, setIsCreateIssueModalOpen] =
    useState(false);

  const [dragOverColumnId, setDragOverColumnId] =
    useState<string | null>(null);

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
    currentBoard,
    boardColumns,
    isBoardLoading,
    fetchBoard,
    fetchBoardColumns,
  } = useProjectStore();

  const {
    issues,
    fetchIssues,
    moveIssue,
  } = useIssueStore();

  useEffect(() => {
    if (
      !organizationSlug ||
      !workspaceSlug ||
      !projectSlug
    ) {
      return;
    }

    fetchBoard(
      organizationSlug,
      workspaceSlug,
      projectSlug,
    );

    fetchBoardColumns(
      organizationSlug,
      workspaceSlug,
      projectSlug,
    );

    fetchIssues(
      organizationSlug,
      workspaceSlug,
      projectSlug,
    );
  }, [
    organizationSlug,
    workspaceSlug,
    projectSlug,
    fetchBoard,
    fetchBoardColumns,
    fetchIssues,
  ]);

  const handleIssueClick = (issueId: string) => {
    if (
      !organizationSlug ||
      !workspaceSlug ||
      !projectSlug
    ) {
      return;
    }

    navigate(
      `/organizations/${organizationSlug}/workspaces/${workspaceSlug}/projects/${projectSlug}/issues/${issueId}`,
    );
  };

  const handleDragOver = (
    event: React.DragEvent,
    columnId: string,
  ) => {
    event.preventDefault();

    event.dataTransfer.dropEffect = "move";
    setDragOverColumnId(columnId);
  };

  const handleDragLeave = () => {
    setDragOverColumnId(null);
  };

  const handleDrop = async (
    event: React.DragEvent,
    columnId: string,
  ) => {
    event.preventDefault();

    const issueId =
      event.dataTransfer.getData("issueId");

    setDragOverColumnId(null);

    if (
      !issueId ||
      !organizationSlug ||
      !workspaceSlug ||
      !projectSlug
    ) {
      return;
    }

    const issue = issues.find(
      (issue) => issue.id === issueId,
    );

    if (!issue || issue.columnId === columnId) {
      return;
    }

    await moveIssue(
      organizationSlug,
      workspaceSlug,
      projectSlug,
      issueId,
      {
        columnId,
      },
    );
  };

  if (isBoardLoading && !currentBoard) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <p className="text-sm text-gray-500">
          Loading board...
        </p>
      </div>
    );
  }

  if (!currentBoard) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <p className="text-sm text-gray-500">
            Board not found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Board Header */}
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">
          {currentBoard.name}
        </h2>

        <button
          type="button"
          onClick={() =>
            setIsCreateIssueModalOpen(true)
          }
          className="flex items-center gap-2 rounded-lg bg-orange-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-orange-600"
        >
          <Plus size={16} />
          Create Issue
        </button>
      </div>

      {/* Board Columns */}
      <div className="flex min-h-125 gap-4 overflow-x-auto pb-4">
        {boardColumns.map((column) => {
          const columnIssues = issues.filter(
            (issue) =>
              issue.columnId === column.id,
          );

          return (
            <div
              key={column.id}
              onDragOver={(event) =>
                handleDragOver(
                  event,
                  column.id,
                )
              }
              onDragLeave={handleDragLeave}
              onDrop={(event) =>
                handleDrop(
                  event,
                  column.id,
                )
              }
              className={`w-70 min-w-70 rounded-xl border bg-gray-100 ${dragOverColumnId === column.id
                  ? "border-orange-400"
                  : "border-gray-200"
                }`}
            >
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex min-w-0 items-center gap-2">
                  <div
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{
                      backgroundColor:
                        column.color || "#9ca3af",
                    }}
                  />

                  <h3 className="truncate text-sm font-semibold text-gray-700">
                    {column.name}
                  </h3>
                </div>

                <span className="rounded-md bg-white px-2 py-0.5 text-xs text-gray-500">
                  {columnIssues.length}
                </span>
              </div>

              <div className="min-h-100 space-y-3 px-3 pb-3">
                {columnIssues.length === 0 ? (
                  <div className="flex h-24 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white/50">
                    <p className="text-xs text-gray-400">
                      No issues yet
                    </p>
                  </div>
                ) : (
                  columnIssues.map((issue) => (
                    <IssueCard
                      key={issue.id}
                      issue={issue}
                      onClick={() =>
                        handleIssueClick(issue.id)
                      }
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}

        {boardColumns.length === 0 && (
          <div className="flex min-h-100 w-full items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white">
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-700">
                No columns yet
              </h3>

              <p className="mt-1 text-xs text-gray-400">
                Use the project menu to manage
                board columns.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Create Issue Modal */}
      {organizationSlug &&
        workspaceSlug &&
        projectSlug && (
          <CreateIssueModal
            isOpen={isCreateIssueModalOpen}
            organizationSlug={organizationSlug}
            workspaceSlug={workspaceSlug}
            projectSlug={projectSlug}
            onClose={() =>
              setIsCreateIssueModalOpen(false)
            }
          />
        )}
    </div>
  );
};

export default ProjectBoard;
