import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import WorkspacePageSkeleton from "@/components/skeleton/WorkspacePage";
import ProjectGrid from "@/modules/project/components/ProjectGrid";
import WorkspaceToolbar from "@/modules/workspace/components/WorkspaceToolbar";
import ProjectList from "../../../modules/project/components/ProjectList";
import { useProjectStore } from "@/store/project.store";
import { useWorkspaceStore } from "@/store/workspace.store";

const WorkspaceOverview = () => {
  const [view, setView] = useState<"grid" | "list">("grid");
  const { organizationSlug, workspaceSlug } = useParams<{
    organizationSlug: string;
    workspaceSlug: string;
  }>();

  const { fetchWorkspace, currentWorkspace, isLoading } = useWorkspaceStore();

  const { fetchProjects, projects } = useProjectStore();

  useEffect(() => {
    if (!organizationSlug || !workspaceSlug) {
      return;
    }

    fetchWorkspace(organizationSlug, workspaceSlug);

    fetchProjects(organizationSlug, workspaceSlug);
  }, [organizationSlug, workspaceSlug, fetchWorkspace, fetchProjects]);

  if (isLoading && !currentWorkspace) {
    return <WorkspacePageSkeleton />;
  }

  return (
    <>
      <WorkspaceToolbar view={view} onViewChange={setView} />
      <div className="mt-6">
        {view === "grid" ? (
          <ProjectGrid />
        ) : (
          <ProjectList projects={projects} />
        )}
      </div>
    </>
  );
};

export default WorkspaceOverview;
