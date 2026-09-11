import {
  LayoutDashboard,
  LogOut,
  ChevronRight,
  Shield,
  User,
  Settings,
  Users,
  ArrowLeft,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import SidebarNav from "./SidebarNav";
import WorkspaceSection from "./WorkspaceSection";

import Button from "@/modules/common/components/ui/Button";
import { logoutUser } from "@/api/auth.api";
import { useOrganizationStore } from "@/store/organization.store";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  onToggle?: () => void;
};

type SettingsGroupProps = {
  title: string;
  pathname: string;
  items: Array<{
    name: string;
    icon: typeof User;
    to: string;
  }>;
  onNavigate: (to: string) => void;
};

const SettingsGroup = ({
  title,
  pathname,
  items,
  onNavigate,
}: SettingsGroupProps) => (
  <div className="mb-5">
    <p className="mb-2 px-2 text-xs font-semibold text-gray-500">
      {title}
    </p>

    <div className="flex flex-col gap-1">
      {items.map((item) => {
        const isActive = pathname === item.to;
        const Icon = item.icon;

        return (
          <button
            key={item.to}
            type="button"
            onClick={() => onNavigate(item.to)}
            className={`group flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors ${isActive
              ? "bg-orange-50 text-orange-600"
              : "text-gray-600 hover:bg-gray-50"
              }`}
          >
            <Icon
              size={18}
              className={isActive ? "text-orange-500" : "text-gray-400"}
            />

            <span
              className={`flex-1 text-sm font-medium ${isActive
                ? "text-orange-600"
                : "text-gray-700"
                }`}
            >
              {item.name}
            </span>

            <ChevronRight
              size={16}
              className={isActive ? "text-orange-500" : "text-gray-300"}
            />
          </button>
        );
      })}
    </div>
  </div>
);

const sidebarItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    to: "/dashboard",
  },
];

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { currentOrganization } = useOrganizationStore();
  const isUserSettings =
    location.pathname === "/settings" ||
    location.pathname.startsWith("/settings/");

  const isOrganizationSettings =
    location.pathname.startsWith("/organizations/") &&
    location.pathname.includes("/settings");

  const isSettingsPage =
    isUserSettings || isOrganizationSettings;

  const userSettingsItems = [
    {
      name: "Profile",
      icon: User,
      to: "/settings/profile",
    },
    {
      name: "Security",
      icon: Shield,
      to: "/settings/security",
    },
  ];

  const organizationSettingsItems = currentOrganization
    ? [
      {
        name: "General",
        icon: Settings,
        to: `/organizations/${currentOrganization.slug}/settings/general`,
      },
      {
        name: "Members",
        icon: Users,
        to: `/organizations/${currentOrganization.slug}/settings/members`,
      },
    ]
    : [];

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleNavigate = (to: string) => {
    navigate(to);
    onClose();
  };

  const navContent = (
    <div className="flex min-h-0 flex-1 flex-col">
      {isSettingsPage ? (
        <>
          {/* Settings Navigation */}
          <div className="px-3 pt-4">
            <button
              type="button"
              onClick={() => handleNavigate("/dashboard")}
              className="mb-5 flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
            >
              <ArrowLeft size={18} />
              <span>Back to Dashboard</span>
            </button>

            <div className="mb-3 px-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-400">
                Settings
              </p>
            </div>

            <SettingsGroup
              title="User Settings"
              items={userSettingsItems}
              pathname={location.pathname}
              onNavigate={navigate}
            />

            {currentOrganization && (
              <SettingsGroup
                title="Organization Settings"
                items={organizationSettingsItems}
                pathname={location.pathname}
                onNavigate={navigate}
              />
            )}
          </div>

          {/* Bottom Actions */}
          <div className="mt-auto shrink-0 border-t border-gray-100 p-3">
            {/* Logout */}
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
        </>
      ) : (
        <>
          {/* Normal Navigation */}
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
        </>
      )}
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

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-[1px] lg:hidden"
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[280px] flex-col bg-white pt-16 shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${isOpen
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
