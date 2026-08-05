import { CalendarDays, FolderKanban, MoreVertical, Settings, Users } from "lucide-react";
import Button from "../ui/Button";

interface WorkspaceHeaderProps {
	name: string;
	description: string;
	projectCount: number;
	memberCount: number;
	createdAt: string;
}

const WorkspaceHeader = ({
	name,
	description,
	projectCount,
	memberCount,
	createdAt,
}: WorkspaceHeaderProps) => {
	return (
		<header className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
			<div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
				<div>
					<p className="text-sm text-gray-500">
						Workspaces
					</p>

					<h1 className="mt-1 text-3xl font-bold text-gray-900">
						{name}
					</h1>

					<p className="mt-2 max-w-2xl text-gray-600">
						{description || "No description provided."}
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
					<span>{projectCount} Projects</span>
				</div>

				<div className="flex items-center gap-2">
					<Users size={18} className="text-orange-500" />
					<span>{memberCount} Members</span>
				</div>

				<div className="flex items-center gap-2">
					<CalendarDays size={18} className="text-orange-500" />
					<span>{createdAt}</span>
				</div>

			</div>


			<nav className="mt-4 flex gap-6 text-sm font-medium">

				<button className="border-b-2 border-orange-500 pb-2 text-orange-500">
					Overview
				</button>

				<button className="pb-2 text-gray-500 hover:text-orange-500">
					Members
				</button>

				<button className="pb-2 text-gray-500 hover:text-orange-500">
					Settings
				</button>

			</nav>
		</header>
	);
};

export default WorkspaceHeader;
