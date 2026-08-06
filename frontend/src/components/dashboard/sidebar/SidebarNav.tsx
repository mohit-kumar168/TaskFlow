import { type LucideIcon } from "lucide-react";
import { NavLink } from "react-router-dom";

type SidebarItem = {
	name: string;
	icon: LucideIcon;
	to: string;
};

type SidebarNavProps = {
	items: SidebarItem[];
};

const linkClasses = ({ isActive }: { isActive: boolean }) =>
	`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 whitespace-nowrap
	${isActive ? "bg-orange-100 text-orange-600" : "text-gray-600 hover:bg-gray-100 hover:text-orange-500"}`;

const SidebarNav = ({ items }: SidebarNavProps) => {
	return (
		<nav className="flex flex-col gap-2 p-2">
			{items.map((item) => {
				const Icon = item.icon;

				return (
					<NavLink key={item.name} to={item.to} className={linkClasses}>
						<Icon size={20} />
						<span>{item.name}</span>
					</NavLink>
				);
			})}
		</nav>
	);
};

export default SidebarNav;