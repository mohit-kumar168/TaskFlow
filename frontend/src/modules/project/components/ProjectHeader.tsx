import {
	MoreHorizontal,
} from "lucide-react";
import {
	NavLink,
	useParams,
} from "react-router-dom";

import type { ProjectProps } from "@/api/project.api";

interface ProjectHeaderProps {
	project: ProjectProps;
}

const ProjectHeader = ({
	project,
}: ProjectHeaderProps) => {
	const {
		organizationSlug,
		workspaceSlug,
		projectSlug,
	} = useParams<{
		organizationSlug: string;
		workspaceSlug: string;
		projectSlug: string;
	}>();

	const basePath = `/organizations/${organizationSlug}/workspaces/${workspaceSlug}/projects/${projectSlug}`;

	return (
		<div className="border-b border-gray-200 bg-white">
			{/* Project information */}
			<div className="flex items-center justify-between px-6 py-5">
				<div className="flex min-w-0 items-center gap-3">
					<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-500 text-sm font-semibold text-white">
						{project.name
							.charAt(0)
							.toUpperCase()}
					</div>

					<div className="min-w-0">
						<h1 className="truncate text-lg font-semibold text-gray-900">
							{project.name}
						</h1>

						{project.description && (
							<p className="mt-0.5 truncate text-sm text-gray-500">
								{project.description}
							</p>
						)}
					</div>
				</div>

				<button
					type="button"
					className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
				>
					<MoreHorizontal size={20} />
				</button>
			</div>

			{/* Project navigation */}
			<div className="flex items-center gap-6 px-6">
				<NavLink
					to={basePath}
					end
					className={({ isActive }) =>
						`border-b-2 py-3 text-sm font-medium transition ${
							isActive
								? "border-orange-500 text-gray-900"
								: "border-transparent text-gray-500 hover:text-gray-900"
						}`
					}
				>
					Overview
				</NavLink>

				<NavLink
					to={`${basePath}/board`}
					className={({ isActive }) =>
						`border-b-2 py-3 text-sm font-medium transition ${
							isActive
								? "border-orange-500 text-gray-900"
								: "border-transparent text-gray-500 hover:text-gray-900"
						}`
					}
				>
					Board
				</NavLink>

				<NavLink
					to={`${basePath}/members`}
					className={({ isActive }) =>
						`border-b-2 py-3 text-sm font-medium transition ${
							isActive
								? "border-orange-500 text-gray-900"
								: "border-transparent text-gray-500 hover:text-gray-900"
						}`
					}
				>
					Members
				</NavLink>
			</div>
		</div>
	);
};

export default ProjectHeader;