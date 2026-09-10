import { Pencil } from "lucide-react";

import type { IssueProps } from "@/api/issue.api";
import type { SprintProps } from "@/api/sprint.api";

import Button from "@/modules/common/components/ui/Button";

interface IssueHeaderProps {
  issue: IssueProps;
  selectedSprint?: SprintProps;
  isEditing: boolean;
  isDisabled: boolean;
  onEdit: () => void;
}

const IssueHeader = ({
  issue,
  selectedSprint,
  isEditing,
  isDisabled,
  onEdit,
}: IssueHeaderProps) => {
  return (
    <div className="flex flex-col gap-4 border-b border-gray-200 px-5 py-5 sm:px-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-medium text-gray-400">
            {issue.issueKey}
          </p>

          <h1 className="mt-1 break-words text-xl font-semibold text-gray-900">
            {issue.title}
          </h1>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-md bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600">
              {issue.type}
            </span>

            <span className="rounded-md bg-orange-50 px-2.5 py-1 text-[11px] font-medium text-orange-600">
              {issue.priority}
            </span>

            <span className="rounded-md bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600">
              {issue.status}
            </span>

            {selectedSprint && (
              <span className="rounded-md bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600">
                {selectedSprint.name}
              </span>
            )}
          </div>
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
      </div>
    </div>
  );
};

export default IssueHeader;