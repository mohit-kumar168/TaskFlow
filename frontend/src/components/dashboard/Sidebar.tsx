import { useEffect, useState } from "react";
import { ChevronRight, Folder, FolderKanban, LayoutDashboard, ListTodo, X, type LucideIcon } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { getWorkspaces, type WorkspaceMemberProps } from "@/api/workspace.api";
import Button from "../ui/Button";
import { logoutUser } from "@/api/auth.api";


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

const slugify = (value: string) => value.toLowerCase().trim().replace(/\s+/g, "-");

const linkClasses = ({ isActive }: { isActive: boolean }) =>
	`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 whitespace-nowrap
	${isActive ? "bg-orange-100 text-orange-600" : "text-gray-600 hover:bg-gray-100 hover:text-orange-500"}`;

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
	const [workspaces, setWorkspaces] = useState<WorkspaceMemberProps[]>([]);
	const [isWorkspacesOpen, setIsWorkspacesOpen] = useState(false);

	const [openWorkspaces, setOpenWorkspaces] = useState<Set<string>>(new Set());

	const navigate = useNavigate();

	useEffect(() => {
		const loadWorkspaces = async () => {
			try {
				const response = await getWorkspaces();
				setWorkspaces(response.data.data);
			} catch (error) {
				console.error(error);
			}
		}
		loadWorkspaces();
	}, [])

	const toggleWorkspace = (name: string) => {
		setOpenWorkspaces((prev) => {
			const next = new Set(prev);
			if (next.has(name)) {
				next.delete(name);
			} else {
				next.add(name);
			}
			return next;
		});
	};

	const navContent = (
		<nav className="flex flex-1 flex-col gap-2 p-4">
			{sidebarItems.map((item) => {
				const Icon = item.icon;

				if (item.name !== "Workspaces") {
					return (
						<NavLink key={item.name} to={item.to ?? "/"} className={linkClasses}>
							<Icon size={20} />
							<span>{item.name}</span>
						</NavLink>
					);
				}
			})}
			<div>
				<button
					type="button"
					onClick={() => setIsWorkspacesOpen((open) => !open)}
					className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-gray-100 hover:text-orange-500"
				>
					<span className="flex items-center gap-3 whitespace-nowrap">
						<FolderKanban size={20} />
						Workspaces
					</span>
					<ChevronRight
						size={16}
						className={`shrink-0 transition-transform duration-200 ${isWorkspacesOpen ? "rotate-90" : ""}`}
					/>
				</button>

				{isWorkspacesOpen && (
					<div className="mt-1 flex flex-col gap-1">
						{workspaces.map((workspaceMember) => {
							const workspace = workspaceMember.workspace;
							const isWorkspaceOpen = openWorkspaces.has(workspace.name);

							return (
								<div key={workspace.name}>
									<button
										type="button"
										onClick={() => toggleWorkspace(workspace.name)}
										className="flex w-full items-center justify-between rounded-lg py-2 pl-10 pr-4 text-sm text-gray-600 transition-all duration-200 hover:bg-gray-100 hover:text-orange-500"
									>

										<div className="flex min-w-0 items-center gap-2">
											<Folder size={15} className="shrink-0" />

											<span className="truncate">
												{workspace.name}
											</span>
										</div>
										<ChevronRight
											size={14}
											className={`shrink-0 transition-transform duration-200 ${isWorkspaceOpen ? "rotate-90" : ""}`}
										/>
									</button>

									{/* isWorkspaceOpen && (
												<div className="flex flex-col gap-1">
													{workspace.projects.map((project) => (
														<NavLink
															key={project}
															to={`/workspaces/${slugify(workspace.name)}/projects/${slugify(project)}`}
															className={({ isActive }) =>
																`flex items-center gap-2 rounded-lg py-2 pl-16 pr-4 text-sm whitespace-nowrap transition-all duration-200
																${isActive ? "bg-orange-100 text-orange-600" : "text-gray-500 hover:bg-gray-100 hover:text-orange-500"}`
															}
														>
															<span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gray-300" />
															{project}
														</NavLink>
													))}
												</div>
											) */}
								</div>
							);
						})}
					</div>
				)}
			</div>
			<div className="mt-auto pt-4 border-t border-gray-200">
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
