import { useEffect, useState } from "react";
import { ChevronRight, Folder, FolderKanban, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useWorkspaceStore } from "@/store/workspace.store";
import { useOrganizationStore } from "@/store/organization.store";
import { useProjectStore } from "@/store/project.store";

const WorkspaceSection = () => {
  const [isWorkspacesOpen, setIsWorkspacesOpen] = useState(false);
  const [openWorkspaces, setOpenWorkspaces] = useState<Set<string>>(new Set());

  const navigate = useNavigate();

  const { workspaces, fetchWorkspaces } = useWorkspaceStore();

  const { currentOrganization } = useOrganizationStore();

  const { projectsByWorkspace, fetchProjects } = useProjectStore();

  useEffect(() => {
    if (!currentOrganization) {
      return;
    }
    setOpenWorkspaces(new Set());

    fetchWorkspaces(currentOrganization.slug);
  }, [currentOrganization, fetchWorkspaces]);

  const toggleWorkspace = async (workspaceSlug: string) => {
    if (!currentOrganization) {
      return;
    }

    const isCurrentlyOpen = openWorkspaces.has(workspaceSlug);

    setOpenWorkspaces((prev) => {
      const next = new Set(prev);

      if (isCurrentlyOpen) {
        next.delete(workspaceSlug);
      } else {
        next.add(workspaceSlug);
      }

      return next;
    });

    if (!isCurrentlyOpen) {
      await fetchProjects(currentOrganization.slug, workspaceSlug);
    }
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
          {/* Create Workspace */}
          <button
            type="button"
            onClick={() => {
              if (!currentOrganization) {
                return;
              }

              navigate(
                `/organizations/${currentOrganization.slug}/workspaces/create`,
              );
            }}
            className="flex items-center gap-2 rounded-lg py-2 pl-10 pr-4 text-sm text-orange-500 transition hover:bg-orange-50"
          >
            <Plus size={15} />
            <span>Create Workspace</span>
          </button>

          {/* Workspaces */}
          {workspaces.map((workspace) => {
            const isWorkspaceOpen = openWorkspaces.has(workspace.slug);

            return (
              <div key={workspace.id}>
                {/* Workspace */}
                <button
                  type="button"
                  onClick={() => {
                    if (!currentOrganization) {
                      return;
                    }

                    toggleWorkspace(workspace.slug);

                    navigate(
                      `/organizations/${currentOrganization.slug}/workspaces/${workspace.slug}`,
                    );
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

                {/* Projects */}
                {isWorkspaceOpen && (
                  <div className="ml-6 flex flex-col gap-1 border-l border-gray-200 pl-2">
                    {projectsByWorkspace[workspace.slug]?.map((project) => (
                      <button
                        key={project.id}
                        type="button"
                        onClick={() => {
                          if (!currentOrganization) {
                            return;
                          }

                          navigate(
                            `/organizations/${currentOrganization.slug}/workspaces/${workspace.slug}/projects/${project.slug}`,
                          );
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-gray-500 transition hover:bg-gray-100 hover:text-orange-500"
                      >
                        <FolderKanban size={14} className="shrink-0" />

                        <span className="truncate">{project.name}</span>
                      </button>
                    ))}

                    {projectsByWorkspace[workspace.slug]?.length === 0 && (
                      <span className="px-3 py-2 text-xs text-gray-400">
                        No projects
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WorkspaceSection;
