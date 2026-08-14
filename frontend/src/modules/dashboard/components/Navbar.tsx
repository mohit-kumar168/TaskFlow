import { PanelRightOpen, Plus, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import TFlogo from "@/assets/taskflow-logo.png";
import SearchInput from "@/components/ui/SearchInput";
import Button from "@/components/ui/Button";
import OrganizationSelector from "@/modules/organization/components/OrganizationSelector";
import SettingsMenu from "../components/SettingsMenu";
import { useState } from "react";

type NavbarProps = {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
};

const Navbar = ({ isSidebarOpen, onToggleSidebar }: NavbarProps) => {
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between gap-2 border-b border-gray-300 bg-white px-2 sm:px-4 md:px-8">
      {/* Left Section */}
      <div className="flex min-w-0 items-center gap-2 sm:gap-4">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="rounded-md p-2 transition-colors hover:bg-gray-100"
        >
          <PanelRightOpen
            className={`h-5 w-5 text-gray-700 transition-transform duration-300 ${isSidebarOpen ? "" : "rotate-180"}`}
          />
        </button>
        <Link to="/dashboard">
          <img
            src={TFlogo}
            alt="TaskFlow Logo"
            className="h-11 w-11 object-contain transition-transform hover:scale-105"
          />
        </Link>
        <OrganizationSelector />
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden w-56 md:block lg:w-72">
          <SearchInput placeholder="Search..." />
        </div>
        <Button className="flex items-center justify-center px-2 py-1.5 sm:w-24 sm:px-1">
          <Plus className="mr-1 h-5 w-5 sm:h-6 sm:w-6" />
          <span className="hidden sm:inline">Create</span>
        </Button>
      </div>
      {/* Right Section */}
      <div className="flex items-center gap-3 md:gap-5">
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsSettingsMenuOpen((prev) => !prev)}
            className={`rounded-full p-2 transition-colors ${isSettingsMenuOpen ? "bg-gray-100" : "hover:bg-gray-100"}`}
          >
            <Settings className="h-5 w-5 text-gray-600" />
          </button>

          {isSettingsMenuOpen && (
            <SettingsMenu onClose={() => setIsSettingsMenuOpen(false)} />
          )}
        </div>
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 shadow transition-transform hover:scale-105">
          <span className="text-xl font-semibold text-white">M</span>
        </button>
      </div>
    </header>
  );
};
export default Navbar;
