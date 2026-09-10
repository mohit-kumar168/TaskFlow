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
  `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${isActive
    ? "bg-orange-50 text-orange-600"
    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
  }`;

const SidebarNav = ({ items }: SidebarNavProps) => {
  return (
    <nav className="flex flex-col gap-1">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.name}
            to={item.to}
            className={linkClasses}
          >
            {({ isActive }) => (
              <>
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-colors ${isActive
                    ? "bg-orange-100 text-orange-600"
                    : "text-gray-500 group-hover:text-gray-800"
                    }`}
                >
                  <Icon size={18} strokeWidth={2} />
                </span>

                <span>{item.name}</span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
};

export default SidebarNav;
