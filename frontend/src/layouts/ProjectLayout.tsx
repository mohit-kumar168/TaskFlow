import { useEffect } from "react";
import { Outlet, useParams } from "react-router-dom";

import ProjectHeader from "../modules/project/components/ProjectHeader";
import { useProjectStore } from "@/store/project.store";

const ProjectLayout = () => {
  const {
    organizationSlug,
    workspaceSlug,
    projectSlug,
  } = useParams<{
    organizationSlug: string;
    workspaceSlug: string;
    projectSlug: string;
  }>();

  const {
    currentProject,
    projectsByWorkspace,
    fetchProject,
    isProjectLoading,
  } = useProjectStore();

  const projectFromList =
    projectsByWorkspace[workspaceSlug ?? ""]?.find(
      (project) => project.slug === projectSlug,
    );

  useEffect(() => {
    if (
      !organizationSlug ||
      !workspaceSlug ||
      !projectSlug
    ) {
      return;
    }

    fetchProject(
      organizationSlug,
      workspaceSlug,
      projectSlug,
    );
  }, [
    organizationSlug,
    workspaceSlug,
    projectSlug,
    fetchProject,
  ]);

  const project = currentProject ?? projectFromList;

  if (isProjectLoading && !project) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <p className="text-sm text-gray-500">
          Loading project...
        </p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <p className="text-sm text-gray-500">
          Project not found.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <ProjectHeader project={project} />

      <Outlet />
    </div>
  );
};

export default ProjectLayout;
