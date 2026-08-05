import { useState } from "react";
import Navbar from "@/components/dashboard/Navbar";
import Sidebar from "@/components/dashboard/Sidebar";
import { Outlet } from "react-router-dom";
import CreateWorkspaceModal from "@/components/dashboard/CreateWorkspaceModal";

const DashboardLayout = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);

	return (
		<div className="h-screen flex flex-col">
			<Navbar isSidebarOpen={isSidebarOpen} onToggleSidebar={() => {
				console.log("Create workspace modal is working...");
				setIsSidebarOpen((open) => !open);
			}} />
			<div className="flex flex-1 overflow-hidden">
				<Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
				<main className="flex-1 overflow-y-auto p-6">
					<Outlet />
				</main>
			</div>
		</div>
	);
};
export default DashboardLayout;
