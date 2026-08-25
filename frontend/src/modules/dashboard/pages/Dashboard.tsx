import { useEffect, useMemo } from "react";
import {
	BriefcaseBusiness,
	FolderKanban,
	Plus,
	ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import Button from "@/components/ui/Button";

import { useAuthStore } from "@/store/auth.store";
import { useOrganizationStore } from "@/store/organization.store";
import { useWorkspaceStore } from "@/store/workspace.store";
import { useProjectStore } from "@/store/project.store";

const Dashboard = () => {
	const navigate = useNavigate();

	const { user } = useAuthStore();

	const {
		organizations,
		currentOrganization,
		fetchOrganizations,
		isLoading: isOrganizationLoading,
	} = useOrganizationStore();

	const {
		workspaces,
		isLoading: isWorkspaceLoading,
		fetchWorkspaces,
	} = useWorkspaceStore();

	const {
		projectsByWorkspace,
		projectsLoadingByWorkspace,
		fetchProjects,
	} = useProjectStore();

	/**
	 * Fetch organizations
	 */
	useEffect(() => {
		if (organizations.length === 0) {
			fetchOrganizations();
		}
	}, [organizations.length, fetchOrganizations]);

	/**
	 * Resolve active organization
	 */
	const organizationSlug =
		currentOrganization?.slug ?? organizations[0]?.slug;

	/**
	 * Fetch workspaces
	 */
	useEffect(() => {
		if (!organizationSlug) {
			return;
		}

		fetchWorkspaces(organizationSlug);
	}, [organizationSlug, fetchWorkspaces]);

	/**
	 * Fetch projects for every workspace
	 */
	useEffect(() => {
		if (!organizationSlug || workspaces.length === 0) {
			return;
		}

		workspaces.forEach((workspace) => {
			fetchProjects(
				organizationSlug,
				workspace.slug,
			);
		});
	}, [
		organizationSlug,
		workspaces,
		fetchProjects,
	]);

	/**
	 * Combine projects from all workspaces
	 */
	const projects = useMemo(() => {
		return workspaces.flatMap((workspace) =>
			(projectsByWorkspace[workspace.slug] ?? []).map(
				(project) => ({
					project,
					workspace,
				}),
			),
		);
	}, [workspaces, projectsByWorkspace]);

	/**
	 * Loading state
	 */
	const isProjectsLoading = workspaces.some(
		(workspace) =>
			projectsLoadingByWorkspace[workspace.slug],
	);

	const isLoading =
		isOrganizationLoading ||
		isWorkspaceLoading ||
		isProjectsLoading;

	/**
	 * Navigation
	 */
	const handleCreateWorkspace = () => {
		if (!organizationSlug) {
			return;
		}

		navigate(
			`/organizations/${organizationSlug}/workspaces/create`,
		);
	};

	const handleProjectClick = (
		workspaceSlug: string,
		projectSlug: string,
	) => {
		if (!organizationSlug) {
			return;
		}

		navigate(
			`/organizations/${organizationSlug}/workspaces/${workspaceSlug}/projects/${projectSlug}`,
		);
	};

	return (
		<div className="min-h-full bg-gray-50/40">
			<div className="mx-auto max-w-[1600px] space-y-8 p-5 sm:p-6 lg:p-8">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h1 className="text-xl md:text-2xl font-semibold tracking-tight text-gray-900">
							Welcome back
							{user?.name
								? `, ${user.name}`
								: ""}
						</h1>

						<p className="mt-1 text-xs md:text-sm text-gray-500">
							Here's what's happening across
							your workspaces and projects.
						</p>
					</div>

					<div className="flex flex-wrap items-center gap-2">
						<Button
							variant="primary"
							size="md"
							disabled={!organizationSlug}
							onClick={handleCreateWorkspace}
						>
							<Plus size={17} />
							Create Workspace
						</Button>
					</div>
				</div>

				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

					{/* Workspaces count card */}
					<div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
						<div className="flex items-center gap-4">
							<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
								<BriefcaseBusiness
									size={21}
									strokeWidth={2}
								/>
							</div>

							<div>
								<p className="text-sm text-gray-500">
									Workspaces
								</p>

								<p className="mt-0.5 text-2xl font-semibold text-gray-900">
									{isLoading
										? "—"
										: workspaces.length}
								</p>

								<p className="mt-0.5 text-xs text-gray-400">
									Available to you
								</p>
							</div>
						</div>
					</div>

					{/* Projects count card */}
					<div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
						<div className="flex items-center gap-4">
							<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
								<FolderKanban
									size={21}
									strokeWidth={2}
								/>
							</div>

							<div>
								<p className="text-sm text-gray-500">
									Projects
								</p>

								<p className="mt-0.5 text-2xl font-semibold text-gray-900">
									{isLoading
										? "—"
										: projects.length}
								</p>

								<p className="mt-0.5 text-xs text-gray-400">
									Across your workspaces
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Projects */}
				<section>
					<div className="mb-4 flex items-end justify-between">
						<div>
							<h2 className="text-lg font-semibold text-gray-900">
								Projects
							</h2>

							<p className="mt-1 text-sm text-gray-500">
								Your projects across all
								workspaces.
							</p>
						</div>
					</div>

					{isLoading && (
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
							{Array.from({ length: 3 }).map(
								(_, index) => (
									<div
										key={index}
										className="h-40 animate-pulse rounded-xl border border-gray-200 bg-white"
									/>
								),
							)}
						</div>
					)}

					{!isLoading &&
						projects.length === 0 && (
							<div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
								<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
									<FolderKanban
										size={22}
									/>
								</div>

								<h3 className="mt-4 text-sm font-semibold text-gray-900">
									No projects yet
								</h3>

								<p className="mx-auto mt-1 max-w-sm text-sm text-gray-500">
									Create a project inside one
									of your workspaces to get
									started.
								</p>
							</div>
						)}

					{/* Projects */}
					{!isLoading &&
						projects.length > 0 && (
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
								{projects.map(
									({
										project,
										workspace,
									}) => (
										<button
											key={project.id}
											type="button"
											onClick={() =>
												handleProjectClick(
													workspace.slug,
													project.slug,
												)
											}
											className="group rounded-xl border border-gray-200 bg-white p-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500/20"
										>
											<div className="flex items-start justify-between gap-4">
												<div className="flex min-w-0 items-center gap-3">
													<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
														<FolderKanban
															size={
																19
															}
														/>
													</div>

													<div className="min-w-0">
														<h3 className="truncate text-sm font-semibold text-gray-900">
															{
																project.name
															}
														</h3>

														<p className="mt-0.5 truncate text-xs text-gray-400">
															{
																workspace.name
															}
														</p>
													</div>
												</div>

												<ArrowRight
													size={17}
													className="shrink-0 text-gray-300 transition-all group-hover:translate-x-0.5 group-hover:text-orange-500"
												/>
											</div>

											{/* Description */}
											<p className="mt-5 line-clamp-2 min-h-[40px] text-sm leading-5 text-gray-500">
												{project.description ||
													"No description provided."}
											</p>

											{/* Footer */}
											<div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
												<span className="text-xs font-medium text-gray-400">
													{
														workspace.name
													}
												</span>

												<span className="text-xs font-medium text-orange-500 opacity-0 transition-opacity group-hover:opacity-100">
													Open project
												</span>
											</div>
										</button>
									),
								)}
							</div>
						)}
				</section>

				{/* Quick Actions */}
				<section>
					<div className="mb-4">
						<h2 className="text-lg font-semibold text-gray-900">
							Quick Actions
						</h2>

						<p className="mt-1 text-sm text-gray-500">
							Common actions to help you get
							started quickly.
						</p>
					</div>

					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<button
							type="button"
							disabled={!organizationSlug}
							onClick={handleCreateWorkspace}
							className="group flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 text-left transition-all hover:border-orange-200 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
						>
							<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
								<Plus size={19} />
							</div>

							<div className="min-w-0">
								<p className="text-sm font-semibold text-gray-900">
									Create Workspace
								</p>

								<p className="mt-0.5 text-xs text-gray-500">
									Start organizing your work
								</p>
							</div>

							<ArrowRight
								size={17}
								className="ml-auto text-gray-300 transition-all group-hover:translate-x-0.5 group-hover:text-orange-500"
							/>
						</button>
					</div>
				</section>
			</div>
		</div>
	);
};

export default Dashboard;
