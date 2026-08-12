import ProjectList from "@/modules/workspace/components/ProjectList"
import WorkspaceHeader from "@/modules/workspace/components/WorkspaceHeader"
import WorkspaceToolbar from "@/modules/workspace/components/WorkspaceToolbar"
import { Outlet } from "react-router-dom"

const WorkspaceLayout = () => {
	return (
		<div className="space-y-2">
			<WorkspaceHeader />
			<Outlet />
		</div>
	)
}

export default WorkspaceLayout
