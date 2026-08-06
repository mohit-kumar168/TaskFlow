import { useWorkspaceStore } from "@/store/workspace.store";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import WorkspacePageSkeleton from "@/components/skeleton/workspacePage";
import WorkspaceToolbar from "@/components/workspace/WorkspaceToolbar";

const WorkspaceOverview = () => {
	const { workspaceId } = useParams();

	const { fetchWorkspace, currentWorkspace, isLoading } = useWorkspaceStore();

	useEffect(() => {
		if (workspaceId) {
			fetchWorkspace(workspaceId);
		}
	}, [workspaceId]);

	if (isLoading && !currentWorkspace) {
		return <WorkspacePageSkeleton />;
	}

	return (
		<>
		<WorkspaceToolbar />
		<div className="rounded-2xl border border-dashed border-gray-200 bg-white/80 p-8 shadow-sm">
			<p className="text-sm font-medium uppercase tracking-[0.2em] text-orange-500">
				Workspace overview
			</p>
			<h2 className="mt-3 text-2xl font-semibold text-gray-900">
				{currentWorkspace?.workspace.name ?? "Workspace"}
			</h2>
			<p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
				{currentWorkspace?.workspace.description ?? "This workspace is ready for projects, members, and issues."}
			</p>
		</div>
		</>
	)
}

export default WorkspaceOverview
