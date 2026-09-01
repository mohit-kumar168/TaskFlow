import { Grid2X2, List } from "lucide-react";

interface WorkspaceToolbarProps {
  view: "grid" | "list";
  onViewChange: (view: "grid" | "list") => void;
}

const WorkspaceToolbar = ({
  view,
  onViewChange,
}: WorkspaceToolbarProps) => {
  return (
    <div>
      <div className="hidden md:flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex w-fit self-start overflow-hidden rounded-lg border border-gray-300 bg-white">
            <button
              type="button"
              onClick={() => onViewChange("grid")}
              aria-label="Grid view"
              className={`flex h-9 w-10 items-center justify-center transition ${view === "grid"
                ? "bg-orange-50 text-orange-500"
                : "text-gray-500 hover:bg-gray-50"
                }`}
            >
              <Grid2X2 size={16} />
            </button>

            <button
              type="button"
              onClick={() => onViewChange("list")}
              aria-label="List view"
              className={`flex h-9 w-10 items-center justify-center border-l border-gray-300 transition ${view === "list"
                ? "bg-orange-50 text-orange-500"
                : "text-gray-500 hover:bg-gray-50"
                }`}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceToolbar;
