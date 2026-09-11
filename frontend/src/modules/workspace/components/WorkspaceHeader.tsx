import {
  Ellipsis,
  Users,
  Settings,
  UserPlus,
  FolderPlus,
} from "lucide-react";
import { useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";

import { useWorkspaceStore } from "@/store/workspace.store";
import WorkspaceSettingsModal from "./WorkspaceSettingsModal";

const WorkspaceHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const navigate = useNavigate();

  const { organizationSlug, workspaceSlug } = useParams<{
    organizationSlug: string;
    workspaceSlug: string;
  }>();

  const { currentWorkspace, isLoading } = useWorkspaceStore();

  if (!organizationSlug || !workspaceSlug) {
    return null;
  }

  if (!currentWorkspace) {
    return (
      <header className="border-b border-gray-200 bg-white">
        <div className="px-6 py-6">
          <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />

          <div className="mt-4 flex items-center gap-4">
            <div className="h-14 w-14 animate-pulse rounded-xl bg-gray-200" />

            <div>
              <div className="h-6 w-48 animate-pulse rounded bg-gray-200" />

              {isLoading && (
                <div className="mt-2 h-4 w-72 animate-pulse rounded bg-gray-100" />
              )}
            </div>
          </div>
        </div>
      </header>
    );
  }

  const workspaceBasePath = `/organizations/${organizationSlug}/workspaces/${workspaceSlug}`;

  const workspaceInitial = currentWorkspace.name
    .charAt(0)
    .toUpperCase();

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="">
        {/* Main workspace information */}
        <div className="pt-4 flex items-start justify-between gap-6">
          <div className="flex min-w-0 items-start gap-4">
            {/* Workspace icon - currently it is only showing the initial letter of the workspace after giving the upload image option to the user i have to change this */}
            <div className="flex h-8 w-8 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-sm md:rounded-xl bg-orange-500 text-sm md:text-xl font-semibold text-white shadow-sm">
              {workspaceInitial}
            </div>

            <div className="min-w-0 flex flex-col items-start justify-center">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-xs md:text-sm font-semibold tracking-tight text-gray-900">
                  {currentWorkspace.name}
                </h1>

                <span className="rounded-md md:bg-orange-50 md:px-2 md:py-1 text-xs font-medium text-orange-600">
                  WORKSPACE
                </span>
              </div>

              <div className="flex flex-wrap items-center">
                {currentWorkspace.description && (
                  <p className="truncate text-xs md:text-xs text-gray-500">
                    {currentWorkspace.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() =>
                navigate(
                  `${workspaceBasePath}/members`,
                )
              }
              className="hidden items-center gap-2 rounded-lg border border-gray-200 bg-white px-2 py-2 text-xs font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50 sm:flex"
            >
              <UserPlus size={12} />
              Members
            </button>

            <button
              type="button"
              onClick={() =>
                navigate(
                  `${workspaceBasePath}/projects/create`,
                )
              }
              className="hidden items-center gap-2 rounded-lg bg-orange-500 px-2 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-orange-600 sm:flex"
            >
              <FolderPlus size={12} />
              Create Project
            </button>

            {/* More menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setIsMenuOpen((open) => !open)
                }
                className={`flex h-6 w-6 md:h-8 md:w-8 items-center justify-center rounded-lg border transition ${isMenuOpen
                  ? "border-gray-300 bg-gray-100 text-gray-900"
                  : "border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  }`}
              >
                <Ellipsis className="w-4 h-4" />
              </button>

              {isMenuOpen && (
                <>
                  <button
                    type="button"
                    className="fixed inset-0 z-10 cursor-default"
                    onClick={() =>
                      setIsMenuOpen(false)
                    }
                  />

                  <div className="absolute right-0 top-12 z-20 w-52 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        navigate(
                          `${workspaceBasePath}/projects/create`,
                        );
                      }}
                      className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-100"
                    >
                      <FolderPlus
                        size={17}
                        className="text-gray-500"
                      />
                      Create Project
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        navigate(
                          `${workspaceBasePath}/members`,
                        );
                      }}
                      className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-100"
                    >
                      <Users
                        size={17}
                        className="text-gray-500"
                      />
                      Members
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsSettingsOpen(true);
                      }}
                      className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-100"
                    >
                      <Settings
                        size={17}
                        className="text-gray-500"
                      />
                      Settings
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-4 flex items-center gap-7">
          <NavLink
            end
            to={workspaceBasePath}
            className={({ isActive }) =>
              `relative pb-3 text-sm font-medium transition-colors ${isActive
                ? "text-orange-500 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-orange-500"
                : "text-gray-500 hover:text-gray-900"
              }`
            }
          >
            Overview
          </NavLink>
        </nav>
      </div>

      <WorkspaceSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        organizationSlug={organizationSlug}
        workspaceSlug={workspaceSlug}
        onDeleted={() => {
          navigate(`/organizations/${organizationSlug}`);
        }}
      />
    </header>
  );
};

export default WorkspaceHeader;
