import { useEffect, useMemo } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useOrganizationStore } from "@/store/organization.store";
import { useWorkspaceStore } from "@/store/workspace.store";
import { useProjectStore } from "@/store/project.store";

const DashboardSearchPage = () => {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const query = (searchParams.get("q") || "").trim();
	const { organizations, currentOrganization, fetchOrganizations } = useOrganizationStore();
	const { workspaces, fetchWorkspaces } = useWorkspaceStore();
	const { projectsByWorkspace, fetchProjects } = useProjectStore();
	const organizationSlug = currentOrganization?.slug ?? organizations[0]?.slug;

	useEffect(() => {
		if (organizations.length === 0) void fetchOrganizations();
	}, [organizations.length, fetchOrganizations]);

	useEffect(() => {
		if (organizationSlug) void fetchWorkspaces(organizationSlug);
	}, [organizationSlug, fetchWorkspaces]);

	useEffect(() => {
		if (!organizationSlug) return;
		workspaces.forEach((workspace) => {
			void fetchProjects(organizationSlug, workspace.slug);
		});
	}, [organizationSlug, workspaces, fetchProjects]);

	const results = useMemo(() => {
		if (!query) return [];
		const lower = query.toLowerCase();
		const workspaceItems = workspaces.map((workspace) => ({
			id: workspace.id,
			title: workspace.name,
			type: "Workspace",
			to: organizationSlug ? `/organizations/${organizationSlug}/workspaces/${workspace.slug}` : undefined,
		}));
		const projectItems = workspaces.flatMap((workspace) =>
			(projectsByWorkspace[workspace.slug] ?? []).map((project) => ({
				id: project.id,
				title: project.name,
				type: "Project",
				to: organizationSlug ? `/organizations/${organizationSlug}/workspaces/${workspace.slug}/projects/${project.slug}` : undefined,
			})),
		);
		return [...workspaceItems, ...projectItems].filter((item) => item.title.toLowerCase().includes(lower));
	}, [query, workspaces, projectsByWorkspace, organizationSlug]);

	return (
		<div className="p-4 md:p-6">
			<div className="mb-4 flex items-center justify-between">
				<h1 className="text-xl font-semibold text-gray-800">Search Results</h1>
				<Link
					to="/dashboard"
					className="text-sm font-medium text-orange-600 hover:text-orange-700"
				>
					Back to Dashboard
				</Link>
			</div>

			{!query ? (
				<p className="text-sm text-gray-500">Type something in navbar search.</p>
			) : (
				<>
					<p className="mb-4 text-sm text-gray-600">
						Showing results for: <span className="font-medium">"{query}"</span>
					</p>

					{results.length === 0 ? (
						<div className="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-500">
							No results found.
						</div>
					) : (
						<ul className="space-y-3">
							{results.map((item) => (
								<li
									key={item.id}
									className="rounded-lg border border-gray-200 bg-white p-4"
								>
									<div className="flex items-center justify-between">
										{item.to ? (
											<button type="button" onClick={() => { if (item.to) navigate(item.to); }} className="font-medium text-gray-800 hover:text-orange-600">
												{item.title}
											</button>
										) : <p className="font-medium text-gray-800">{item.title}</p>}
										<span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
											{item.type}
										</span>
									</div>
								</li>
							))}
						</ul>
					)}
				</>
			)}
		</div>
	);
};

export default DashboardSearchPage;