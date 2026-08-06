import { FolderKanban, MoreVertical, Settings, Users } from "lucide-react";
import Button from "../ui/Button";
import { useWorkspaceStore } from "../../store/workspace.store";
import WorkspacePageSkeleton from "../skeleton/workspacePage";
import { NavLink, useNavigate } from "react-router-dom";



const WorkspaceHeader = () => {
	const { currentWorkspace, isLoading } = useWorkspaceStore();
	const navigate = useNavigate();

	if (isLoading && !currentWorkspace) {
		return <WorkspacePageSkeleton variant="header" />;
	}

	if (!currentWorkspace) return null;

	const linkClass = ({ isActive }: { isActive: boolean }) =>
		`pb-2 ${isActive ? "text-orange-500" : "text-gray-500 hover:text-orange-500"}`;

	return (
		<header className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
			<div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
				<div>
					<p className="text-sm text-gray-500">
						Workspaces
					</p>

					<h1 className="mt-1 text-3xl font-bold text-gray-900">
						{currentWorkspace.workspace.name}
					</h1>

					<p className="mt-2 max-w-2xl text-gray-600">
						{currentWorkspace.workspace.description || "No description provided."}
					</p>
				</div>

				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						className="w-auto border-gray-300 px-4 py-2 text-gray-700"
					>
						<Settings size={16} />
					</Button>

					<Button
						variant="outline"
						className="w-auto border-gray-300 px-4 py-2 text-gray-700"
					>
						<MoreVertical size={16} />
					</Button>
				</div>
			</div>

			<div className="mt-6 flex flex-wrap gap-6 border-y border-gray-200 py-4 text-sm text-gray-600">

				<div className="flex items-center gap-2">
					<FolderKanban size={18} className="text-orange-500" />
					<span>{currentWorkspace.workspace._count?.projects ?? 0} Projects</span>
				</div>

				<div className="flex items-center gap-2">
					<Users size={18} className="text-orange-500" />
					<span>{currentWorkspace.workspace._count?.members ?? 0} Members</span>
				</div>
			</div>


			<nav className="mt-4 flex gap-6 text-sm font-medium">

				<NavLink end to={`/workspaces/${currentWorkspace.workspaceId}`} className={linkClass}>
					Overview
				</NavLink>

				<NavLink end to={`/workspaces/${currentWorkspace.workspaceId}/members`} className={linkClass}>
					Members
				</NavLink>

				<NavLink end to={`/workspaces/${currentWorkspace.workspaceId}/settings`} className={linkClass}>
					Settings
				</NavLink>

			</nav>
		</header>
	);
};

export default WorkspaceHeader;
