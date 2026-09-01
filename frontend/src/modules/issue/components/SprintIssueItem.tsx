import type { IssueProps } from "@/api/issue.api";

interface SprintIssueItemProps {
  issue: IssueProps;
  sprintName?: string | null;
  onClick?: () => void;
}

const SprintIssueItem = ({
  issue,
  sprintName,
  onClick,
}: SprintIssueItemProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-lg border border-gray-200 bg-white p-3 text-left transition hover:border-orange-300 hover:bg-orange-50/30"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-medium text-gray-400">
            {issue.issueKey}
          </p>

          <p className="mt-1 truncate text-sm font-medium text-gray-800">
            {issue.title}
          </p>

          {sprintName && (
            <p className="mt-1 text-[11px] font-medium text-orange-600">
              Sprint: {sprintName}
            </p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600">
            {issue.status}
          </span>

          <span className="rounded-md bg-orange-50 px-2 py-1 text-xs text-orange-600">
            {issue.priority}
          </span>
        </div>
      </div>
    </button>
  );
};

export default SprintIssueItem;
