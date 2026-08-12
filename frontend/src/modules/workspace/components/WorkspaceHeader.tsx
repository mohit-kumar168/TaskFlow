import { Ellipsis, Users } from "lucide-react";
import { useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";

import { useWorkspaceStore } from "@/store/workspace.store";

const WorkspaceHeader = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const navigate = useNavigate();

	const { organizationSlug, workspaceSlug } = useParams<{
		organizationSlug: string;
		workspaceSlug: string;
	}>();

	const { currentWorkspace } = useWorkspaceStore();

	if (!currentWorkspace || !organizationSlug || !workspaceSlug) {
		return null;
	}

	const workspaceBasePath = `/organizations/${organizationSlug}/workspaces/${workspaceSlug}`;

	return (
		<header className="border-b border-gray-200 bg-white">
			<div className="px-5 pt-4 sm:px-6">
				{/* Workspace information */}
				<div className="flex items-start justify-between gap-4">
					<div className="flex min-w-0 items-center gap-3">
						{/* Workspace icon */}
						<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-500 text-sm font-semibold text-white">
							{currentWorkspace.name
								.charAt(0)
								.toUpperCase()}
						</div>

						<div className="min-w-0">
							<h1 className="truncate text-lg font-semibold text-gray-900">
								{currentWorkspace.name}
							</h1>

							{currentWorkspace.description && (
								<p className="mt-0.5 truncate text-sm text-gray-500">
									{currentWorkspace.description}
								</p>
							)}
						</div>
					</div>

					{/* Right side actions */}
					<div className="relative flex shrink-0 items-center gap-2">
						<button
							type="button"
							onClick={() =>
								setIsMenuOpen((open) => !open)
							}
							className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
						>
							<Ellipsis size={19} />
						</button>

						{/* Dropdown */}
						{isMenuOpen && (
							<>
								<button
									type="button"
									aria-label="Close menu"
									className="fixed inset-0 z-10 cursor-pointer"
									onClick={() =>
										setIsMenuOpen(false)
									}
								/>

								<div className="absolute right-0 top-10 z-20 w-48 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
									<button
										type="button"
										onClick={() => {
											setIsMenuOpen(false);

											navigate(
												`${workspaceBasePath}/projects/create`,
											);
										}}
										className="flex w-full items-center px-3 py-2.5 text-left text-sm text-gray-700 transition hover:bg-gray-100 cursor-pointer"
									>
										Create Project
									</button>
									<button
										type="button"
										onClick={() => {
											setIsMenuOpen(false);

											navigate(
												`${workspaceBasePath}/members`,
											);
										}}
										className="flex w-full items-center px-3 py-2.5 text-left text-sm text-gray-700 transition hover:bg-gray-100 cursor-pointer"
									>
										Members
									</button>

									<button
										type="button"
										onClick={() => {
											setIsMenuOpen(false);

											navigate(
												`${workspaceBasePath}/settings`,
											);
										}}
										className="flex w-full items-center px-3 py-2.5 text-left text-sm text-gray-700 transition hover:bg-gray-100 cursor-pointer"
									>
										Settings
									</button>
								</div>
							</>
						)}
					</div>
				</div>

				{/* Workspace navigation */}
				<nav className="mt-4 flex items-center gap-6">
					<NavLink
						end
						to={workspaceBasePath}
						className={({ isActive }) =>
							`relative py-3 text-sm font-medium transition-colors ${
								isActive
									? "text-gray-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-orange-500"
									: "text-gray-500 hover:text-gray-900"
							}`
						}
					>
						Overview
					</NavLink>
				</nav>
			</div>
		</header>
	);
};

export default WorkspaceHeader;