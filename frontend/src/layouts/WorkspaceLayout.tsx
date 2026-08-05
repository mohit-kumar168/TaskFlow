import ProjectList from "@/components/workspace/ProjectList"
import WorkspaceHeader from "@/components/workspace/WorkspaceHeader"
import WorkspaceToolbar from "@/components/workspace/WorkspaceToolbar"

const WorkspaceLayout = () => {
	return (
		<div className="space-y-6">
			<WorkspaceHeader />
			<WorkspaceToolbar />
			<ProjectList />
		</div>
	)
}

export default WorkspaceLayout
