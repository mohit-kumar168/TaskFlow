import { FolderKanban, Users, CircleDot } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import type { ProjectProps } from "@/api/project.api";

interface ProjectListProps {
	projects: ProjectProps[];
}

const ProjectList = ({ projects }: ProjectListProps) => {
	const navigate = useNavigate();

	const {
		organizationSlug,
		workspaceSlug,
	} = useParams<{
		organizationSlug: string;
		workspaceSlug: string;
	}>();

	const handleProjectClick = (projectSlug: string) => {
		if (!organizationSlug || !workspaceSlug) {
			return;
		}

		navigate(
			`/organizations/${organizationSlug}/workspaces/${workspaceSlug}/projects/${projectSlug}`,
		);
	};

	return (
		<div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
			<div className="overflow-x-auto">
				<table className="w-full min-w-175">
					<thead className="border-b border-gray-200 bg-gray-50">
						<tr>
							<th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
								Project
							</th>

							<th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
								Description
							</th>

							<th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
								Members
							</th>

							<th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
								Issues
							</th>

							<th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
								Updated
							</th>
						</tr>
					</thead>

					<tbody className="divide-y divide-gray-100">
						{projects.map((project) => (
							<tr
								key={project.id}
								onClick={() =>
									handleProjectClick(
										project.slug,
									)
								}
								className="cursor-pointer transition hover:bg-gray-50"
							>
								{/* Project */}
								<td className="px-5 py-4">
									<div className="flex items-center gap-3">
										<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
											<FolderKanban
												size={17}
											/>
										</div>

										<div className="min-w-0">
											<p className="truncate text-sm font-medium text-gray-900">
												{project.name}
											</p>

											<p className="mt-0.5 text-xs text-gray-400">
												{project.key}
											</p>
										</div>
									</div>
								</td>

								{/* Description */}
								<td className="max-w-xs px-5 py-4">
									<p className="truncate text-sm text-gray-500">
										{project.description ||
											"No description"}
									</p>
								</td>

								{/* Members */}
								<td className="px-5 py-4">
									<div className="flex items-center gap-2 text-sm text-gray-600">
										<Users
											size={15}
											className="text-gray-400"
										/>

										{project._count
											?.members ?? 0}
									</div>
								</td>

								{/* Issues */}
								<td className="px-5 py-4">
									<div className="flex items-center gap-2 text-sm text-gray-600">
										<CircleDot
											size={15}
											className="text-gray-400"
										/>

										{project._count
											?.issues ?? 0}
									</div>
								</td>

								{/* Updated */}
								<td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
									{new Date(
										project.updatedAt,
									).toLocaleDateString()}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default ProjectList;