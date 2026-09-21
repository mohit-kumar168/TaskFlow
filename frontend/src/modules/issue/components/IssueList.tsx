import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import type {
  IssuePagination,
  IssueProps,
} from "@/api/issue.api";

interface IssueListProps {
  issues: IssueProps[];
  pagination: IssuePagination;
  isLoading: boolean;
  onIssueClick: (
    issueId: string,
  ) => void;
  onPageChange: (
    page: number,
  ) => void;
}

const IssueList = ({
  issues,
  pagination,
  isLoading,
  onIssueClick,
  onPageChange,
}: IssueListProps) => {
  if (isLoading && issues.length === 0) {
    return (
      <div className="flex min-h-100 items-center justify-center rounded-xl border border-gray-200 bg-white">
        <p className="text-sm text-gray-500">
          Loading issues...
        </p>
      </div>
    );
  }

  if (
    !isLoading &&
    issues.length === 0
  ) {
    return (
      <div className="flex min-h-100 items-center justify-center rounded-xl border border-gray-200 bg-white">
        <div className="text-center">
          <p className="text-sm font-medium text-gray-700">
            No issues found.
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Create an issue to get
            started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-225 border-collapse">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                Issue
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                Type
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                Status
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                Priority
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                Assignee
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                Due Date
              </th>
            </tr>
          </thead>

          <tbody>
            {issues.map((issue) => (
              <tr
                key={issue.id}
                onClick={() =>
                  onIssueClick(
                    issue.id,
                  )
                }
                className="cursor-pointer border-b border-gray-100 transition hover:bg-gray-50 last:border-b-0"
              >
                {/* Issue */}
                <td className="px-5 py-4">
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-400">
                      {issue.issueKey}
                    </p>

                    <p className="mt-1 max-w-80 truncate text-sm font-medium text-gray-800">
                      {issue.title}
                    </p>
                  </div>
                </td>

                {/* Type */}
                <td className="px-5 py-4">
                  <span className="rounded-md bg-orange-50 px-2 py-1 text-xs font-medium text-orange-600">
                    {issue.type}
                  </span>
                </td>

                {/* Status */}
                <td className="px-5 py-4">
                  <span className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                    {formatStatus(
                      issue.status,
                    )}
                  </span>
                </td>

                {/* Priority */}
                <td className="px-5 py-4">
                  <span
                    className={`rounded-md px-2 py-1 text-xs font-medium ${getPriorityClass(
                      issue.priority,
                    )}`}
                  >
                    {issue.priority}
                  </span>
                </td>

                {/* Assignee */}
                <td className="px-5 py-4">
                  {issue.assignee ? (
                    <div className="flex items-center gap-2">
                      {issue.assignee
                        .avatarUrl ? (
                        <img
                          src={
                            issue
                              .assignee
                              .avatarUrl
                          }
                          alt={
                            issue
                              .assignee
                              .name
                          }
                          className="h-7 w-7 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-500">
                          {getInitials(
                            issue
                              .assignee
                              .name,
                          )}
                        </div>
                      )}

                      <span className="max-w-32 truncate text-sm text-gray-600">
                        {
                          issue
                            .assignee
                            .name
                        }
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">
                      Unassigned
                    </span>
                  )}
                </td>

                {/* Due Date */}
                <td className="px-5 py-4">
                  <span className="text-sm text-gray-500">
                    {issue.dueDate
                      ? formatDate(
                        issue.dueDate,
                      )
                      : "—"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-gray-200 px-5 py-3">
        <p className="text-xs text-gray-500">
          Showing{" "}
          <span className="font-medium text-gray-700">
            {Math.min(
              (pagination.page - 1) *
              pagination.limit +
              1,
              pagination.total,
            )}
          </span>{" "}
          -{" "}
          <span className="font-medium text-gray-700">
            {Math.min(
              pagination.page *
              pagination.limit,
              pagination.total,
            )}
          </span>{" "}
          of{" "}
          <span className="font-medium text-gray-700">
            {pagination.total}
          </span>
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={
              !pagination.hasPreviousPage ||
              isLoading
            }
            onClick={() =>
              onPageChange(
                pagination.page - 1,
              )
            }
            className="flex items-center gap-1 rounded-md border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={14} />
            Previous
          </button>

          <span className="px-2 text-xs font-medium text-gray-600">
            Page {pagination.page} of{" "}
            {pagination.totalPages}
          </span>

          <button
            type="button"
            disabled={
              !pagination.hasNextPage ||
              isLoading
            }
            onClick={() =>
              onPageChange(
                pagination.page + 1,
              )
            }
            className="flex items-center gap-1 rounded-md border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

const formatStatus = (
  status: IssueProps["status"],
) => {
  switch (status) {
    case "TODO":
      return "To Do";

    case "IN_PROGRESS":
      return "In Progress";

    case "IN_REVIEW":
      return "In Review";

    case "DONE":
      return "Done";

    default:
      return status;
  }
};

const getPriorityClass = (
  priority: IssueProps["priority"],
) => {
  switch (priority) {
    case "URGENT":
      return "bg-red-50 text-red-600";

    case "HIGH":
      return "bg-orange-50 text-orange-600";

    case "MEDIUM":
      return "bg-yellow-50 text-yellow-600";

    case "LOW":
      return "bg-gray-100 text-gray-600";

    default:
      return "bg-gray-100 text-gray-600";
  }
};

const getInitials = (
  name: string,
) => {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

const formatDate = (
  date: string,
) => {
  return new Date(
    date,
  ).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  );
};

export default IssueList;
