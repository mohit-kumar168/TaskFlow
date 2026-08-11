import { Grid2X2, List, Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";

const WorkspaceToolbar = () => {
	const navigate = useNavigate();

	return (
		<div>

			<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
				<div className="flex flex-col gap-3 lg:flex-row lg:items-center">

					<div className="relative flex-1">

						<Search
							size={16}
							className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
						/>

						<input
							type="text"
							placeholder="Search projects..."
							className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-orange-500"
						/>

					</div>

					<select className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
						<option>Recently Updated</option>
						<option>A-Z</option>
						<option>Newest</option>
						<option>Oldest</option>
					</select>

					<div className="flex overflow-hidden rounded-lg border border-gray-300">

						<button className="border-r border-gray-300 p-2 hover:bg-gray-100">
							<Grid2X2 size={16} />
						</button>

						<button className="p-2 hover:bg-gray-100">
							<List size={16} />
						</button>

					</div>

				</div>

				<Button
					className="flex items-center gap-2 px-4 py-2 lg:w-auto"
					onClick={() => navigate("projects/create")}
				>
					<Plus size={16} />
					New Project
				</Button>

			</div>


		</div>
	);
};

export default WorkspaceToolbar;
