import {
  PanelRightOpen,
  Plus,
  Settings,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import TFlogo from "@/assets/taskflow-logo.png";
import SearchInput from "@/components/ui/SearchInput";
import OrganizationSelector from "@/modules/organization/components/OrganizationSelector";
import SettingsMenu from "../components/SettingsMenu";
import NotificationDropdown from "./NotificationDropdown";

import { useAuthStore } from "@/store/auth.store";
import Button from "@/components/ui/Button";

type NavbarProps = {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
};

const Navbar = ({
  isSidebarOpen,
  onToggleSidebar,
}: NavbarProps) => {
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] =
    useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  const { user } = useAuthStore();

  const handleSearch = () => {
    const q = searchQuery.trim();

    if (!q) {
      return;
    }

    navigate(
      `/dashboard/search?q=${encodeURIComponent(q)}`,
    );
  };

  const userInitial =
    user?.name?.charAt(0).toUpperCase() || "M";

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-3 border-b border-gray-200 bg-white px-3 sm:px-4 lg:px-6">
      {/* Left Section */}
      <div className="flex min-w-fit items-center gap-4">
        {/* Sidebar Toggle */}
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label={
            isSidebarOpen
              ? "Collapse sidebar"
              : "Expand sidebar"
          }
          className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
        >
          <PanelRightOpen
            className={`h-5 w-5 transition-transform duration-300 ${isSidebarOpen
              ? ""
              : "rotate-180"
              }`}
          />
        </button>

        {/* Logo */}
        <Link
          to="/dashboard"
          className="hidden items-center sm:flex"
        >
          <img
            src={TFlogo}
            alt="TaskFlow"
            className="h-10 w-10 object-contain"
          />
        </Link>
      </div>

      {/* Organization Selector and Searchbar */}
      <div className="flex flex-1 items-center justify-center gap-4 px-2 sm:px-4">
        <div className="ml-1 rounded-lg border border-gray-300 px-1 py-1.5 hover:bg-gray-100">
          <OrganizationSelector />
        </div>

        <div className="hidden w-full max-w-xl md:block">
          <SearchInput
            placeholder="Search across tasks, projects, workspaces..."
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex min-w-fit items-center gap-1 sm:gap-2">
        {/* Create */}
        <Button
          type="button"
          className=""
          title="Create"
        >
          <Plus className="h-5 w-5" />
        </Button>

        {/* Notifications */}
        <NotificationDropdown />

        {/* Settings */}
        <div className="relative">
          <button
            type="button"
            onClick={() =>
              setIsSettingsMenuOpen(
                (prev) => !prev,
              )
            }
            aria-label="Settings"
            className={`flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors sm:h-10 sm:w-10 ${isSettingsMenuOpen
              ? "bg-gray-100 text-gray-800"
              : "hover:bg-gray-100 hover:text-gray-800"
              }`}
          >
            <Settings className="h-5 w-5" />
          </button>

          {isSettingsMenuOpen && (
            <SettingsMenu
              onClose={() =>
                setIsSettingsMenuOpen(
                  false,
                )
              }
            />
          )}
        </div>

        {/* User */}
        <button
          type="button"
          className="ml-1 flex items-center gap-2 rounded-lg px-1.5 py-1.5 transition-colors hover:bg-gray-100"
          title={user?.name || "Profile"}
        >
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt="user avatar"
              className="h-9 w-9 rounded-full"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-sm font-semibold text-white">
              {userInitial}
            </div>
          )}

          <div className="hidden max-w-32 text-left lg:block">
            <p className="truncate text-sm font-medium text-gray-900">
              {user?.name || "User"}
            </p>

            <p className="truncate text-xs text-gray-500">
              {user?.email || ""}
            </p>
          </div>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
