import { Check, Play } from "lucide-react";

import { type IssueProps } from "@/api/issue.api";
import type { SprintProps } from "@/api/sprint.api";

import SprintIssueItem from "./SprintIssueItem";

interface SprintIssuePanelProps {
  currentSprint: SprintProps | null;
  sprintIssues: IssueProps[];
  isFetchingIssues: boolean;
  isStarting: boolean;
  isCompleting: boolean;
  onStartSprint: () => void;
  onCompleteSprint: () => void;
  onIssueClick: (issue: IssueProps) => void;
}

const SprintIssuePanel = ({
  currentSprint,
  sprintIssues,
  isFetchingIssues,
  isStarting,
  isCompleting,
  onStartSprint,
  onCompleteSprint,
  onIssueClick,
}: SprintIssuePanelProps) => {
  if (!currentSprint) {
    return (
      <div className="flex min-h-100 items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white">
        <div className="text-center">
          <h3 className="text-sm font-medium text-gray-700">
            Select a sprint
          </h3>

          <p className="mt-1 text-xs text-gray-400">
            Choose a sprint to view its issues and details.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="border-b border-gray-200 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-gray-900">
                {currentSprint.name}
              </h2>

              <span className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                {currentSprint.status}
              </span>
            </div>

            {currentSprint.goal && (
              <p className="mt-2 max-w-2xl text-sm text-gray-500">
                {currentSprint.goal}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            {currentSprint.status === "PLANNING" && (
              <button
                type="button"
                onClick={onStartSprint}
                disabled={isStarting}
                className="flex items-center gap-2 rounded-lg bg-orange-500 px-3 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Play size={15} />
                {isStarting ? "Starting..." : "Start Sprint"}
              </button>
            )}

            {currentSprint.status === "ACTIVE" && (
              <button
                type="button"
                onClick={onCompleteSprint}
                disabled={isCompleting}
                className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Check size={15} />
                {isCompleting ? "Completing..." : "Complete Sprint"}
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-500">
          {currentSprint.startDate && (
            <span>
              Start: {new Date(currentSprint.startDate).toLocaleDateString()}
            </span>
          )}

          {currentSprint.endDate && (
            <span>
              End: {new Date(currentSprint.endDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      <div className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-800">
            Sprint Issues
          </h3>

          <span className="text-xs text-gray-400">
            {sprintIssues.length} issues
          </span>
        </div>

        {isFetchingIssues ? (
          <div className="py-10 text-center">
            <p className="text-sm text-gray-500">Loading issues...</p>
          </div>
        ) : sprintIssues.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
            <p className="text-sm text-gray-500">No issues in this sprint.</p>

            <p className="mt-1 text-xs text-gray-400">
              Assign issues to this sprint from the issue details.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {sprintIssues.map((issue) => (
              <SprintIssueItem
                key={issue.id}
                issue={issue}
                sprintName={currentSprint.name}
                onClick={() => onIssueClick(issue)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SprintIssuePanel;
