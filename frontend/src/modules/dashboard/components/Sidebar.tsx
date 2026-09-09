import {
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import SidebarNav from "./SidebarNav";
import WorkspaceSection from "./WorkspaceSection";

import Button from "@/components/ui/Button";
import { logoutUser } from "@/api/auth.api";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  onToggle?: () => void;
};

const sidebarItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    to: "/dashboard",
  },
];

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navContent = (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Main Navigation */}
      <div className="px-3 pt-4">
        <SidebarNav items={sidebarItems} />
      </div>

      {/* Workspaces */}
      <div className="mt-6 min-h-0 flex-1 overflow-y-auto px-3 pb-4 scrollbar-thin">
        <WorkspaceSection />
      </div>

      {/* Logout */}
      <div className="shrink-0 border-t border-gray-100 p-3">
        <Button
          type="button"
          variant="primary"
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 py-2.5 text-sm font-medium"
        >
          <LogOut size={17} />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden h-[calc(100vh-4rem)] shrink-0 overflow-hidden border-r border-gray-200 bg-white transition-all duration-300 ease-in-out lg:flex lg:flex-col ${isOpen
          ? "lg:w-[270px]"
          : "lg:w-0 lg:border-r-0"
          }`}
      >
        <div className="flex h-full w-[270px] flex-col">
          {navContent}
        </div>
      </aside>

      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-[1px] lg:hidden"
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 pt-16 flex w-[280px] flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${isOpen
          ? "translate-x-0"
          : "-translate-x-full"
          }`}
      >
        {navContent}
      </aside>
    </>
  );
};

export default Sidebar;
