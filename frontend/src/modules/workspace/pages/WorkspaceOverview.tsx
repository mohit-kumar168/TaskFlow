import { useWorkspaceStore } from "@/store/workspace.store";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import WorkspacePageSkeleton from "@/components/skeleton/WorkspacePage";
import WorkspaceToolbar from "@/modules/workspace/components/WorkspaceToolbar";
import ProjectGrid from "@/modules/project/components/ProjectGrid";
import { useProjectStore } from "@/store/project.store";

const WorkspaceOverview = () => {
	const { workspaceId } = useParams();

	const { fetchWorkspace, currentWorkspace, isLoading } = useWorkspaceStore();
	const { fetchProjects } = useProjectStore();

	useEffect(() => {
		if (!workspaceId) return;

		fetchWorkspace(workspaceId);
		fetchProjects(workspaceId);
	}, [workspaceId, fetchWorkspace, fetchProjects]);

	if (isLoading && !currentWorkspace) {
		return <WorkspacePageSkeleton />;
	}

	return (
		<>
			<WorkspaceToolbar />
			<ProjectGrid />
		</>
	)
}

export default WorkspaceOverview
