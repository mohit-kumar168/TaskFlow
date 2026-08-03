import { PanelRightOpen, Plus, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import TFlogo from "@/assets/taskflow-logo.png";
import SearchInput from "../ui/SearchInput";
import Button from "../ui/Button";

type NavbarProps = {
	isSidebarOpen: boolean;
	onToggleSidebar: () => void;
};

const Navbar = ({ isSidebarOpen, onToggleSidebar }: NavbarProps) => {
	return (
		<header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-gray-300 bg-white px-4 md:px-8">
			{/* Left Section */}
			<div className="flex items-center gap-4">
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
			</div>
			<div className="flex items-center gap-4">
				<div className="hidden w-56 md:block lg:w-72">
					<SearchInput placeholder="Search..." />
				</div>
				<Button className="flex items-center justify-center md:w-24 md:px-1 md:py-1.5">
					<Plus className="h-6 w-6 mr-1" />
					Create
				</Button>
			</div>
			{/* Right Section */}
			<div className="flex items-center gap-3 md:gap-5">
				<button className="rounded-full p-2 transition-colors hover:bg-gray-100">
					<Settings className="h-5 w-5 text-gray-600" />
				</button>
				<button className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 shadow transition-transform hover:scale-105">
					<span className="text-xl font-semibold text-white">M</span>
				</button>
			</div>
		</header>
	);
};
export default Navbar;
