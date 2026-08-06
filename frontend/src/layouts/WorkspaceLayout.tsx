import ProjectList from "@/components/workspace/ProjectList"
import WorkspaceHeader from "../components/workspace/WorkspaceHeader"
import WorkspaceToolbar from "@/components/workspace/WorkspaceToolbar"
import { Outlet } from "react-router-dom"

const WorkspaceLayout = () => {
	return (
		<div className="space-y-6">
			<WorkspaceHeader />
			<Outlet />
		</div>
	)
}

export default WorkspaceLayout
