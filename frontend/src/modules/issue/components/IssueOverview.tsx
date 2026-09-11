import type { IssueProps } from "@/api/issue.api";
import type { SprintProps } from "@/api/sprint.api";

import Button from "@/modules/common/components/ui/Button";

import AttachmentSection from "./AttachmentSection";
import { Pencil } from "lucide-react";

interface IssueOverviewProps {
  issue: IssueProps;
  selectedSprint?: SprintProps;
  isEditing: boolean;
  isDisabled: boolean;
  isArchiving: boolean;
  onEdit: () => void;
  onRemove: () => void;
}

const IssueOverview = ({
  issue,
  selectedSprint,
  isEditing,
  isDisabled,
  isArchiving,
  onEdit,
  onRemove,
}: IssueOverviewProps) => {
  return (
    <div className="space-y-2">
      <section className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-gray-400">
            Description
          </p>

          {issue.description ? (
            <p className="mt-1 whitespace-pre-wrap break-words text-xs leading-6 text-gray-700">
              {issue.description}
            </p>
          ) : (
            <p className="mt-2 text-xs italic text-gray-400">
              No description provided.
            </p>
          )}

        </div>
        {!isEditing && (
          <Button
            type="button"
            variant="outline"
            onClick={onEdit}
            disabled={isDisabled}
            className="flex shrink-0 items-center gap-2"
          >
            <Pencil size={14} />
            Edit
          </Button>
        )}

      </section>

      <section className="rounded-xl border border-gray-200 bg-gray-50/50 p-4">
        <div className="grid grid-cols-1 gap-x-2 gap-y-2">
          <Detail label="Type" value={issue.type} />
          <Detail label="Priority" value={issue.priority} />
          <Detail label="Status" value={issue.status} />
          <Detail
            label="Sprint"
            value={selectedSprint?.name ?? "No Sprint"}
          />
          <Detail
            label="Due Date"
            value={
              issue.dueDate
                ? new Date(issue.dueDate).toLocaleDateString()
                : "No due date"
            }
          />
          <Detail
            label="Assignee"
            value={issue.assignee?.name ?? "Unassigned"}
          />
        </div>
      </section>

      <AttachmentSection issueId={issue.id} />

      <div className="border-t border-gray-200 pt-5">
        <Button
          type="button"
          variant="outline"
          onClick={onRemove}
          disabled={isDisabled}
          className="w-full text-sm font-medium text-red-600 hover:bg-red-50"
        >
          {isArchiving ? "Removing..." : "Remove Issue"}
        </Button>
      </div>
    </div>
  );
};

interface DetailProps {
  label: string;
  value: string;
}

const Detail = ({ label, value }: DetailProps) => {
  return (
    <div className="grid grid-cols-2">
      <p className="text-sm font-medium uppercase tracking-wide text-gray-400">
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-medium text-gray-800">
        {value}
      </p>
    </div>
  );
};

export default IssueOverview;
