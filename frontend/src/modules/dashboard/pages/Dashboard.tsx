import { useEffect, useMemo } from "react";
import {
	FolderKanban,
	Plus,
	BriefcaseBusiness,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

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


	useEffect(() => {
		if (organizations.length === 0) {
			fetchOrganizations();
		}
	}, [organizations.length, fetchOrganizations]);


	const organizationSlug =
		currentOrganization?.slug ?? organizations[0]?.slug;


	useEffect(() => {
		if (!organizationSlug) {
			return;
		}

		fetchWorkspaces(organizationSlug);
	}, [organizationSlug, fetchWorkspaces]);


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


	const isProjectsLoading = workspaces.some(
		(workspace) =>
			projectsLoadingByWorkspace[workspace.slug],
	);

	const isLoading =
		isOrganizationLoading ||
		isWorkspaceLoading ||
		isProjectsLoading;

	return (
		<div className="space-y-8 p-6">
			<div>
				<h1 className="text-xl font-semibold text-gray-900">
					Welcome back
					{user?.name ? `, ${user.name}` : ""}
				</h1>

				<p className="mt-1 text-sm text-gray-500">
					Here's what's happening across your
					workspaces and projects.
				</p>
			</div>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<div className="rounded-xl border border-gray-200 bg-white p-5">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
							<BriefcaseBusiness size={20} />
						</div>

						<div>
							<p className="text-xs font-medium text-gray-500">
								Workspaces
							</p>

							<p className="mt-1 text-xl font-semibold text-gray-900">
								{isLoading
									? "—"
									: workspaces.length}
							</p>
						</div>
					</div>
				</div>

				<div className="rounded-xl border border-gray-200 bg-white p-5">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
							<FolderKanban size={20} />
						</div>

						<div>
							<p className="text-xs font-medium text-gray-500">
								Projects
							</p>

							<p className="mt-1 text-xl font-semibold text-gray-900">
								{isLoading
									? "—"
									: projects.length}
							</p>
						</div>
					</div>
				</div>
			</div>

			<div>
				<div className="mb-4">
					<h2 className="text-base font-semibold text-gray-900">
						Quick Actions
					</h2>

					<p className="mt-1 text-sm text-gray-500">
						Get started with your workspace.
					</p>
				</div>

				<div className="flex flex-wrap gap-3">
					<button
						type="button"
						disabled={!organizationSlug}
						onClick={() => {
							if (!organizationSlug) {
								return;
							}

							navigate(
								`/organizations/${organizationSlug}/workspaces/create`,
							);
						}}
						className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-orange-300 hover:text-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
					>
						<Plus size={16} />
						Create Workspace
					</button>
				</div>
			</div>

			<div>
				<div className="mb-4">
					<h2 className="text-base font-semibold text-gray-900">
						Projects
					</h2>

					<p className="mt-1 text-sm text-gray-500">
						Your projects across all workspaces.
					</p>
				</div>

				{isLoading ? (
					<div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
						<p className="text-sm text-gray-500">
							Loading projects...
						</p>
					</div>
				) : projects.length === 0 ? (
					<div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
						<FolderKanban
							size={24}
							className="mx-auto text-gray-400"
						/>

						<h3 className="mt-3 text-sm font-medium text-gray-700">
							No projects yet
						</h3>

						<p className="mt-1 text-xs text-gray-400">
							Create a project from one of your
							workspaces to get started.
						</p>
					</div>
				) : (
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
						{projects.map(
							({ project, workspace }) => (
								<button
									key={project.id}
									type="button"
									onClick={() => {
										if (
											!organizationSlug
										) {
											return;
										}

										navigate(
											`/organizations/${organizationSlug}/workspaces/${workspace.slug}/projects/${project.slug}`,
										);
									}}
									className="rounded-xl border border-gray-200 bg-white p-5 text-left transition hover:border-orange-300 hover:shadow-sm"
								>
									<div className="flex items-start justify-between gap-3">
										<div className="min-w-0">
											<h3 className="truncate text-sm font-semibold text-gray-900">
												{project.name}
											</h3>

											<p className="mt-1 text-xs text-gray-400">
												{
													workspace.name
												}
											</p>
										</div>

										<FolderKanban
											size={18}
											className="shrink-0 text-orange-500"
										/>
									</div>

									<p className="mt-3 line-clamp-2 text-sm text-gray-500">
										{project.description ||
											"No description provided."}
									</p>
								</button>
							),
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default Dashboard;
