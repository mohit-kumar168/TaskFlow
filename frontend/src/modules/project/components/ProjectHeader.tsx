import { Ellipsis } from "lucide-react";
import { useState } from "react";
import { NavLink, useParams } from "react-router-dom";

import type { ProjectProps } from "@/api/project.api";
import ProjectSettings from "../pages/ProjectSettings";

interface ProjectHeaderProps {
  project: ProjectProps;
}

const ProjectHeader = ({ project }: ProjectHeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const {
    organizationSlug,
    workspaceSlug,
    projectSlug,
  } = useParams<{
    organizationSlug: string;
    workspaceSlug: string;
    projectSlug: string;
  }>();

  if (!organizationSlug || !workspaceSlug || !projectSlug) {
    return null;
  }

  const basePath = `/organizations/${organizationSlug}/workspaces/${workspaceSlug}/projects/${projectSlug}`;

  const projectInitial = project.name.charAt(0).toUpperCase();

  const handleCreateIssue = () => {
    setIsMenuOpen(false);

    window.dispatchEvent(new Event("open-create-issue"));
  };

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="px-5 pt-5 sm:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <NavLink
            to={`/organizations/${organizationSlug}/workspaces/${workspaceSlug}`}
            className="text-gray-500 transition hover:text-gray-900"
          >
            Workspace
          </NavLink>

          <span className="text-gray-300">›</span>

          <span className="font-medium text-gray-900">
            {project.name}
          </span>
        </div>

        {/* Project information */}
        <div className="mt-5 flex items-start justify-between gap-4 sm:gap-6">
          <div className="flex min-w-0 items-start gap-3 sm:gap-4">
            {/* Project icon - Change it when image upload option is provided to the user */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-500 text-base font-semibold text-white shadow-sm sm:h-14 sm:w-14 sm:rounded-xl sm:text-xl">
              {projectInitial}
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-sm md:text-lg font-semibold tracking-tight text-gray-900 sm:text-2xl">
                {project.name}
              </h1>

              <div className="mt-1.5 flex flex-wrap items-center gap-2 sm:mt-2 sm:gap-3">
                <span className="rounded-md md:bg-orange-50 md:px-2 md:py-1 text-xs font-semibold tracking-wide text-orange-600">
                  PROJECT
                </span>

                {project.key && (
                  <span className="text-xs font-medium uppercase tracking-wide text-gray-400 sm:text-sm">
                    {project.key}
                  </span>
                )}

                {project.description && (
                  <p className="hidden max-w-2xl truncate text-sm text-gray-500 md:block">
                    {project.description}
                  </p>
                )}
              </div>

              {project.description && (
                <p className="mt-1.5 line-clamp-2 text-xs text-gray-500 md:hidden">
                  {project.description}
                </p>
              )}
            </div>
          </div>

          <div className="relative flex shrink-0 items-center">
            <button
              type="button"
              onClick={() =>
                setIsMenuOpen((open) => !open)
              }
              className={`flex h-6 w-6 md:h-8 md:w-8 items-center justify-center rounded-full md:rounded-lg border transition sm:h-10 sm:w-10 ${isMenuOpen
                ? "border-gray-300 bg-gray-100 text-gray-900"
                : "border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
            >
              <Ellipsis size={19} />
            </button>

            {isMenuOpen && (
              <>
                <button
                  type="button"
                  aria-label="Close menu"
                  className="fixed inset-0 z-10 cursor-default"
                  onClick={() =>
                    setIsMenuOpen(false)
                  }
                />

                <div className="absolute right-0 top-11 z-20 w-52 overflow-hidden rounded-xl border border-gray-200 bg-white py-1.5 shadow-lg">
                  <button
                    type="button"
                    onClick={handleCreateIssue}
                    className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm text-gray-700 transition hover:bg-gray-50"
                  >
                    Create Column
                  </button>

                  <div className="my-1 border-t border-gray-100" />

                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsSettingsOpen(true);
                    }}
                    className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm text-gray-700 transition hover:bg-gray-50"
                  >
                    Project Settings
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <nav className="mt-6 flex items-center gap-6 overflow-x-auto sm:gap-7">
          <NavLink
            to={basePath}
            end
            className={({ isActive }) =>
              `relative shrink-0 pb-3 text-sm font-medium transition-colors ${isActive
                ? "text-orange-500 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-orange-500"
                : "text-gray-500 hover:text-gray-900"
              }`
            }
          >
            Overview
          </NavLink>

          <NavLink
            to={`${basePath}/board`}
            className={({ isActive }) =>
              `relative shrink-0 pb-3 text-sm font-medium transition-colors ${isActive
                ? "text-orange-500 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-orange-500"
                : "text-gray-500 hover:text-gray-900"
              }`
            }
          >
            Board
          </NavLink>

          <NavLink
            to={`${basePath}/sprints`}
            className={({ isActive }) =>
              `relative shrink-0 pb-3 text-sm font-medium transition-colors ${isActive
                ? "text-orange-500 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-orange-500"
                : "text-gray-500 hover:text-gray-900"
              }`
            }
          >
            Sprints
          </NavLink>

          <NavLink
            to={`${basePath}/members`}
            className={({ isActive }) =>
              `relative shrink-0 pb-3 text-sm font-medium transition-colors ${isActive
                ? "text-orange-500 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-orange-500"
                : "text-gray-500 hover:text-gray-900"
              }`
            }
          >
            Members
          </NavLink>
        </nav>
      </div>

      <ProjectSettings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        organizationSlug={organizationSlug}
        workspaceSlug={workspaceSlug}
        projectSlug={projectSlug}
      />
    </header>
  );
};

export default ProjectHeader;
