import { Grid2X2, List, Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";

const WorkspaceToolbar = () => {
	const navigate = useNavigate();

	return (
		<div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

			<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

				<div>
					<h2 className="text-xl font-semibold text-gray-900">
						Projects
					</h2>

					<p className="mt-1 text-sm text-gray-500">
						Browse and manage projects inside this workspace.
					</p>
				</div>

				<Button
					className="w-full lg:w-auto flex items-center gap-2"
					onClick={() => navigate("projects/create")}
				>
					<Plus size={18} />
					New Project
				</Button>

			</div>

			<div className="mt-5 flex flex-col gap-3 lg:flex-row">

				<div className="relative flex-1">

					<Search
						size={18}
						className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
					/>

					<input
						type="text"
						placeholder="Search projects..."
						className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 outline-none focus:border-orange-500"
					/>

				</div>

				<select className="rounded-lg border border-gray-300 px-4 py-2">
					<option>All</option>
					<option>Active</option>
					<option>Archived</option>
				</select>

				<select className="rounded-lg border border-gray-300 px-4 py-2">
					<option>Recently Updated</option>
					<option>A-Z</option>
					<option>Newest</option>
					<option>Oldest</option>
				</select>

				<div className="flex rounded-lg border border-gray-300">

					<button className="border-r border-gray-300 p-2 hover:bg-gray-100">
						<Grid2X2 size={18} />
					</button>

					<button className="p-2 hover:bg-gray-100">
						<List size={18} />
					</button>

				</div>

			</div>

		</div>
	);
};

export default WorkspaceToolbar;