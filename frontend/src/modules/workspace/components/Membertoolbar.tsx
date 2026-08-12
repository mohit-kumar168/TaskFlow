import Button from "@/components/ui/Button";
import { Plus, Search } from "lucide-react";

const MembersToolbar = () => {
	return (
		<div>

			<div className="flex gap-4 md:flex-row md:items-center">
				<div className="relative">

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


				<Button className="w-full md:w-auto flex items-center gap-2">
					<Plus size={18} />
					Add Member
				</Button>

			</div>


		</div>
	);
};

export default MembersToolbar;
