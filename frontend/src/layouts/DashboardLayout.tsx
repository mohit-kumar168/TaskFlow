import { useEffect, useState } from "react";
import Navbar from "@/modules/dashboard/components/Navbar";
import Sidebar from "../modules/dashboard/components/Sidebar";
import { Outlet } from "react-router-dom";
import { useOrganizationStore } from "@/store/organization.store";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const { currentOrganization, fetchOrganizations } = useOrganizationStore();

  useEffect(() => {
    if (!currentOrganization) {
      fetchOrganizations();
    }
  }, [currentOrganization, fetchOrganizations]);

  return (
    <div className="h-screen flex flex-col">
      <Navbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => {
          setIsSidebarOpen((open) => !open);
        }}
        onOpenSettings={() => setIsSidebarOpen(true)}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <main className="flex-1 overflow-y-auto px-4 md:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
export default DashboardLayout;
