import type { SprintProps } from "@/api/sprint.api";

interface SprintCardProps {
  sprint: SprintProps;
  isSelected: boolean;
  onClick: () => void;
}

const SprintCard = ({
  sprint,
  isSelected,
  onClick,
}: SprintCardProps) => {
  const statusClasses = {
    PLANNING:
      "bg-gray-100 text-gray-600",
    ACTIVE:
      "bg-orange-50 text-orange-600",
    COMPLETED:
      "bg-green-50 text-green-600",
  };

  const formatDate = (
    date?: string | null,
  ) => {
    if (!date) {
      return null;
    }

    return new Date(date).toLocaleDateString(
      undefined,
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      },
    );
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-xl border bg-white p-5 text-left transition ${isSelected
        ? "border-orange-400 shadow-sm"
        : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
        }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-gray-900">
            {sprint.name}
          </h3>

          {sprint.goal && (
            <p className="mt-1 line-clamp-2 text-xs text-gray-500">
              {sprint.goal}
            </p>
          )}
        </div>

        <span
          className={`shrink-0 rounded-md px-2 py-1 text-xs font-medium ${statusClasses[sprint.status]}`}
        >
          {sprint.status}
        </span>
      </div>

      {(sprint.startDate ||
        sprint.endDate) && (
          <div className="mt-4 flex flex-wrap gap-3 text-xs text-gray-500">
            {sprint.startDate && (
              <span>
                Start:{" "}
                {formatDate(
                  sprint.startDate,
                )}
              </span>
            )}

            {sprint.endDate && (
              <span>
                End:{" "}
                {formatDate(
                  sprint.endDate,
                )}
              </span>
            )}
          </div>
        )}
    </button>
  );
};

export default SprintCard;
