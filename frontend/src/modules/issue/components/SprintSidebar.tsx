import type { SprintProps } from "@/api/sprint.api";

interface SprintSidebarProps {
  sprints: SprintProps[];
  currentSprintId?: string | null;
  onSelectSprint: (sprint: SprintProps) => void;
  onCreateSprint: () => void;
}

const SprintSidebar = ({
  sprints,
  currentSprintId,
  onSelectSprint,
  onCreateSprint,
}: SprintSidebarProps) => {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-800">
          All Sprints
        </h3>

        <span className="text-xs text-gray-400">
          {sprints.length}
        </span>
      </div>

      {sprints.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
          <p className="text-sm text-gray-500">
            No sprints created yet.
          </p>

          <button
            type="button"
            onClick={onCreateSprint}
            className="mt-3 text-sm font-medium text-orange-500 hover:text-orange-600"
          >
            Create your first sprint
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {sprints.map((sprint) => (
            <button
              key={sprint.id}
              type="button"
              onClick={() => onSelectSprint(sprint)}
              className={`w-full rounded-xl border bg-white p-5 text-left transition ${
                currentSprintId === sprint.id
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
                  className={`shrink-0 rounded-md px-2 py-1 text-xs font-medium ${
                    sprint.status === "PLANNING"
                      ? "bg-gray-100 text-gray-600"
                      : sprint.status === "ACTIVE"
                        ? "bg-orange-50 text-orange-600"
                        : "bg-green-50 text-green-600"
                  }`}
                >
                  {sprint.status}
                </span>
              </div>

              {(sprint.startDate || sprint.endDate) && (
                <div className="mt-4 flex flex-wrap gap-3 text-xs text-gray-500">
                  {sprint.startDate && (
                    <span>
                      Start: {new Date(sprint.startDate).toLocaleDateString()}
                    </span>
                  )}

                  {sprint.endDate && (
                    <span>
                      End: {new Date(sprint.endDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SprintSidebar;
