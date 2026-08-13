import Button from "@/components/ui/Button";
import { Plus, Search } from "lucide-react";

interface MembersToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onAddMember: () => void;
}

const MembersToolbar = ({
  search,
  onSearchChange,
  onAddMember,
}: MembersToolbarProps) => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="relative w-full md:w-80">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          value={search}
          onChange={(event) =>
            onSearchChange(event.target.value)
          }
          placeholder="Search members..."
          className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 outline-none focus:border-orange-500"
        />
      </div>

      <Button
        type="button"
        onClick={onAddMember}
        className="flex w-full items-center justify-center gap-2 md:w-auto"
      >
        <Plus size={18} />
        Add Member
      </Button>
    </div>
  );
};

export default MembersToolbar;