import SearchInput from "@/components/ui/SearchInput";
import Button from "@/components/ui/Button";
import { Plus } from "lucide-react";

interface MemberToolbarProps {
	search: string;
	onSearchChange: (value: string) => void;
	placeholder?: string;
	onAddMember?: () => void;
	addLabel?: string;
}

const MemberToolbar = ({
	search,
	onSearchChange,
	placeholder = "Search members...",
	onAddMember,
	addLabel = "Add Member",
}: MemberToolbarProps) => {
	return (
		<div className="flex flex-col items-stretch justify-between gap-4 md:flex-row md:items-center">
			<div className="w-full max-w-sm">
				<SearchInput
					value={search}
					onChange={(event) =>
						onSearchChange(event.target.value)
					}
					placeholder={placeholder}
				/>
			</div>
			{onAddMember && (
				<Button type="button" onClick={onAddMember} className="flex w-full items-center justify-center gap-2 md:w-auto">
					<Plus size={18} />
					{addLabel}
				</Button>
			)}
		</div>
	);
};

export default MemberToolbar;
