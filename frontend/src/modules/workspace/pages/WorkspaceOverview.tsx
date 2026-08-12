import { useEffect } from "react";
import { useParams } from "react-router-dom";

import WorkspacePageSkeleton from "@/components/skeleton/WorkspacePage";
import ProjectGrid from "@/modules/project/components/ProjectGrid";
import WorkspaceToolbar from "@/modules/workspace/components/WorkspaceToolbar";

import { useOrganizationStore } from "@/store/organization.store";
import { useProjectStore } from "@/store/project.store";
import { useWorkspaceStore } from "@/store/workspace.store";

const WorkspaceOverview = () => {
	const {
		organizationSlug,
		workspaceSlug,
	} = useParams<{
		organizationSlug: string;
		workspaceSlug: string;
	}>();

	const { currentOrganization } = useOrganizationStore();

	const {
		fetchWorkspace,
		currentWorkspace,
		isLoading,
	} = useWorkspaceStore();

	const { fetchProjects } = useProjectStore();

	useEffect(() => {
		if (!organizationSlug || !workspaceSlug) {
			return;
		}

		fetchWorkspace(
			organizationSlug,
			workspaceSlug,
		);

		fetchProjects(
			organizationSlug,
			workspaceSlug,
		);
	}, [
		organizationSlug,
		workspaceSlug,
		fetchWorkspace,
		fetchProjects,
	]);

	if (isLoading && !currentWorkspace) {
		return <WorkspacePageSkeleton />;
	}

	return (
		<>
			<WorkspaceToolbar />
			<ProjectGrid />
		</>
	);
};

export default WorkspaceOverview;