import { LayoutDashboard, ListTodo, X, type LucideIcon } from "lucide-react";
import Button from "../../../components/ui/Button";
import { logoutUser } from "@/api/auth.api";
import { useNavigate } from "react-router-dom";
import SidebarNav from "./SidebarNav";
import WorkspaceSection from "./WorkspaceSection";

type SidebarProps = {
	isOpen: boolean;
	onClose: () => void;
};

interface SidebarItem {
	name: string;
	icon: LucideIcon;
	to: string;
}

const sidebarItems: SidebarItem[] = [
	{
		name: "Dashboard",
		icon: LayoutDashboard,
		to: "/dashboard",
	},
	{
		name: "My Tasks",
		icon: ListTodo,
		to: "/issues",
	},
];

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
	const navigate = useNavigate();
	const navContent = (
		<nav className="flex flex-1 flex-col gap-2">
			<SidebarNav items={sidebarItems} />
			<WorkspaceSection />
			<div className="mt-auto p-2 border-t border-gray-200">
				<Button onClick={async () => {
					await logoutUser();
					navigate("/login");
				}} className="w-full">
					Logout
				</Button>
			</div>
		</nav>
	);

	return (
		<>
			<aside
				className={`hidden h-[92vh] shrink-0 overflow-hidden border-r border-gray-300 bg-white transition-all duration-300 ease-in-out lg:flex lg:flex-col
				${isOpen ? "lg:w-64" : "lg:w-0 lg:border-r-0"}`}
			>
				<div className="flex h-full w-64 flex-col">{navContent}</div>
			</aside>

			{isOpen && <div onClick={onClose} className="fixed inset-0 z-30 bg-black/40 lg:hidden" />}

			<aside
				className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-white shadow-xl transition-transform duration-300 ease-in-out lg:hidden
				${isOpen ? "translate-x-0" : "-translate-x-full"}`}
			>
				<div className="flex items-center justify-between border-b border-gray-300 p-4">
					<span className="text-lg font-bold text-orange-500">TaskFlow</span>
					<button type="button" onClick={onClose}>
						<X size={20} className="text-gray-500" />
					</button>
				</div>
				{navContent}
			</aside>
		</>
	);
};

export default Sidebar;
