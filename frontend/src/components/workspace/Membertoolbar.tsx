import Button from "../ui/Button";
import { Plus, Search } from "lucide-react";

const MembersToolbar = () => {
	return (
		<div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

				<div>
					<h2 className="text-xl font-semibold text-gray-900">
						Workspace Members
					</h2>

					<p className="text-sm text-gray-500">
						Manage members and their roles.
					</p>
				</div>

				<Button className="w-full md:w-auto flex items-center gap-2">
					<Plus size={18} />
					Add Member
				</Button>

			</div>

			<div className="relative mt-5">

				<Search
					size={18}
					className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
				/>

				<input
					type="text"
					placeholder="Search members..."
					className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 outline-none focus:border-orange-500"
				/>

			</div>

		</div>
	);
};

export default MembersToolbar;