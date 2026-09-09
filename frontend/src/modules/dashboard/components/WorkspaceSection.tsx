import { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useWorkspaceStore } from "@/store/workspace.store";
import { useOrganizationStore } from "@/store/organization.store";
import { useProjectStore } from "@/store/project.store";

const workspaceColors = [
  "bg-violet-500",
  "bg-blue-500",
  "bg-pink-500",
  "bg-emerald-500",
  "bg-orange-500",
];

const projectDotColors = [
  "bg-orange-500",
  "bg-emerald-500",
  "bg-violet-500",
  "bg-blue-400",
  "bg-pink-400",
];

const WorkspaceSection = () => {
  const navigate = useNavigate();

  const [openWorkspaces, setOpenWorkspaces] =
    useState<Set<string>>(new Set());

  const {
    workspaces,
    fetchWorkspaces,
  } = useWorkspaceStore();

  const { currentOrganization } =
    useOrganizationStore();

  const {
    projectsByWorkspace,
    fetchProjects,
  } = useProjectStore();

  useEffect(() => {
    if (!currentOrganization) {
      return;
    }

    setOpenWorkspaces(new Set());

    const loadWorkspaces = async () => {
      await fetchWorkspaces(
        currentOrganization.slug,
      );
    };

    loadWorkspaces();
  }, [currentOrganization, fetchWorkspaces]);

  const toggleWorkspace = async (
    workspaceSlug: string,
  ) => {
    if (!currentOrganization) {
      return;
    }

    const isOpen =
      openWorkspaces.has(workspaceSlug);

    setOpenWorkspaces((previous) => {
      const next = new Set(previous);

      if (isOpen) {
        next.delete(workspaceSlug);
      } else {
        next.add(workspaceSlug);
      }

      return next;
    });

    if (!isOpen) {
      await fetchProjects(
        currentOrganization.slug,
        workspaceSlug,
      );
    }
  };

  const getWorkspaceInitials = (
    name: string,
  ) => {
    const words = name
      .trim()
      .split(/\s+/);

    if (words.length >= 2) {
      return `${words[0]?.[0] ?? ""}${words[1]?.[0] ?? ""
        }`.toUpperCase();
    }

    return (
      name
        .trim()
        .slice(0, 2)
        .toUpperCase()
    );
  };

  return (
    <section>
      {/* Section Header */}
      <div className="mb-2 flex items-center justify-between px-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-400">
          Workspaces
        </span>

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
          aria-label="Create workspace"
          title="Create workspace"
          className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition-all duration-200 hover:bg-orange-50 hover:text-orange-500"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Workspace List */}
      <div className="flex flex-col gap-1">
        {workspaces.map((workspace, index) => {
          const isOpen =
            openWorkspaces.has(workspace.slug);

          const workspaceColor =
            workspaceColors[
            index % workspaceColors.length
            ];

          const projects =
            projectsByWorkspace[
            workspace.slug
            ] ?? [];

          return (
            <div key={workspace.id}>
              {/* Workspace */}
              <button
                type="button"
                onClick={() =>
                  toggleWorkspace(
                    workspace.slug,
                  )
                }
                className={`group flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left transition-all duration-200 ${isOpen
                  ? "bg-gray-50"
                  : "hover:bg-gray-50"
                  }`}
              >
                {/* Workspace Avatar */}
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[10px] font-bold tracking-wide text-white shadow-sm ${workspaceColor}`}
                >
                  {getWorkspaceInitials(
                    workspace.name,
                  )}
                </span>

                {/* Workspace Name */}
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  {workspace.name}
                </span>

                {/* Arrow */}
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-gray-400">
                  {isOpen ? (
                    <ChevronDown size={15} />
                  ) : (
                    <ChevronRight size={15} />
                  )}
                </span>
              </button>

              {/* Projects */}
              {isOpen && (
                <div className="ml-[18px] mt-1 border-l border-gray-200 pl-4">
                  {projects.map(
                    (
                      project,
                      projectIndex,
                    ) => {
                      const dotColor =
                        projectDotColors[
                        projectIndex %
                        projectDotColors.length
                        ];

                      return (
                        <button
                          key={project.id}
                          type="button"
                          onClick={() => {
                            if (
                              !currentOrganization
                            ) {
                              return;
                            }

                            navigate(
                              `/organizations/${currentOrganization.slug}/workspaces/${workspace.slug}/projects/${project.slug}`,
                            );
                          }}
                          className="group flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-all duration-200 hover:bg-gray-50"
                        >
                          <span
                            className={`h-2 w-2 shrink-0 rounded-full ${dotColor}`}
                          />

                          <span className="min-w-0 truncate text-[13px] text-gray-500 transition-colors group-hover:text-gray-900">
                            {project.name}
                          </span>
                        </button>
                      );
                    },
                  )}

                  {projects.length === 0 && (
                    <div className="px-2 py-2 text-xs text-gray-400">
                      No projects
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {workspaces.length === 0 && (
          <div className="rounded-lg px-2 py-3 text-sm text-gray-400">
            No workspaces yet
          </div>
        )}
      </div>
    </section>
  );
};

export default WorkspaceSection;
