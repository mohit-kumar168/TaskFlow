import { useEffect, useState } from "react";
import { ChevronRight, Folder, FolderKanban, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useWorkspaceStore } from "@/store/workspace.store";
import { useOrganizationStore } from "@/store/organization.store";

const WorkspaceSection = () => {
  const [isWorkspacesOpen, setIsWorkspacesOpen] = useState(false);

  const [openWorkspaces, setOpenWorkspaces] = useState<Set<string>>(new Set());

  const navigate = useNavigate();

  const { workspaces, fetchWorkspaces } = useWorkspaceStore();

  const { currentOrganization } = useOrganizationStore();

  useEffect(() => {
    if (!currentOrganization) {
      return;
    }

    fetchWorkspaces(currentOrganization.slug);
  }, [currentOrganization, fetchWorkspaces]);

  const toggleWorkspace = (name: string) => {
    setOpenWorkspaces((prev) => {
      const next = new Set(prev);

      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }

      return next;
    });
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsWorkspacesOpen((open) => !open)}
        className="group flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-gray-100 hover:text-orange-500"
      >
        <span className="flex items-center gap-3 whitespace-nowrap">
          <FolderKanban size={20} />
          Workspaces
        </span>

        <ChevronRight
          size={16}
          className={`shrink-0 transition-transform duration-200 ${
            isWorkspacesOpen ? "rotate-90" : ""
          }`}
        />
      </button>

      {isWorkspacesOpen && (
        <div className="mt-1 flex flex-col gap-1">
          <button
            type="button"
            onClick={() => navigate("/workspaces/create")}
            className="flex items-center gap-2 rounded-lg py-2 pl-10 pr-4 text-sm text-orange-500 transition hover:bg-orange-50"
          >
            <Plus size={15} />
            <span>Create Workspace</span>
          </button>

          {workspaces.map((workspace) => {
            const isWorkspaceOpen = openWorkspaces.has(workspace.name);

            return (
              <div key={workspace.id}>
                <button
                  type="button"
                  onClick={() => {
                    toggleWorkspace(workspace.name);

                    navigate(`/workspaces/${workspace.slug}`);
                  }}
                  className="flex w-full items-center justify-between rounded-lg py-2 pl-10 pr-4 text-sm text-gray-600 transition-all duration-200 hover:bg-gray-100 hover:text-orange-500"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <Folder size={15} className="shrink-0" />

                    <span className="truncate">{workspace.name}</span>
                  </div>

                  <ChevronRight
                    size={14}
                    className={`shrink-0 transition-transform duration-200 ${
                      isWorkspaceOpen ? "rotate-90" : ""
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WorkspaceSection;
