import { Grid2X2, List, Plus, Search } from "lucide-react";

interface WorkspaceToolbarProps {
  view: "grid" | "list";
  onViewChange: (view: "grid" | "list") => void;
}

const WorkspaceToolbar = ({ view, onViewChange }: WorkspaceToolbarProps) => {
  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex overflow-hidden rounded-lg border border-gray-300">
            <button
              type="button"
              onClick={() => onViewChange("grid")}
              className={`border-r border-gray-300 p-2 transition ${
                view === "grid"
                  ? "bg-orange-50 text-orange-50"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              <Grid2X2 size={16} />
            </button>

            <button
              type="button"
              onClick={() => onViewChange("list")}
              className={`border-r border-gray-300 p-2 transition ${
                view === "list"
                  ? "bg-orange-50 text-orange-50"
                  : "text-gray-500 hover:bg-gray-100"
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
