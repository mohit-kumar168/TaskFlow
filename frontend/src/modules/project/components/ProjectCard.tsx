import { CalendarDays, FolderKanban, MoreVertical, Users } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

interface ProjectCardProps {
	id: string;
	projectSlug: string;
	name: string;
	key: string;
	description: string;
	memberCount: number;
	issueCount: number;
	updatedAt: string;
}

const ProjectCard = ({
	id,
	projectSlug,
	name,
	key,
	description,
	memberCount,
	issueCount,
	updatedAt,
}: ProjectCardProps) => {
	const navigate = useNavigate();
	const { organizationSlug, workspaceSlug } = useParams();

	return (
		<div
			onClick={() =>
				navigate(`/organizations/${organizationSlug}/workspaces/${workspaceSlug}/projects/${projectSlug}`)
			}
			className="cursor-pointer rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-orange-300 hover:shadow-lg"
		>
			<div className="flex items-start justify-between">
				<div>
					<h3 className="text-lg font-semibold text-gray-900">
						{name}
					</h3>

					<p className="mt-1 text-sm font-medium uppercase tracking-wide text-orange-500">
						{key}
					</p>
				</div>

				<button
					onClick={(e) => e.stopPropagation()}
					className="rounded-lg p-2 hover:bg-gray-100"
				>
					<MoreVertical size={18} />
				</button>
			</div>

			<p className="mt-4 line-clamp-2 min-h-12 text-sm text-gray-600">
				{description || "No description provided."}
			</p>

			<div className="mt-5 border-t border-gray-200 pt-4">
				<div className="flex items-center justify-between text-sm text-gray-600">

					<div className="flex items-center gap-4">

						<div className="flex items-center gap-1">
							<Users size={16} className="text-orange-500" />
							<span>{memberCount}</span>
						</div>

						<div className="flex items-center gap-1">
							<FolderKanban size={16} className="text-orange-500" />
							<span>{issueCount}</span>
						</div>

					</div>

					<div className="flex items-center gap-1 text-xs">

						<CalendarDays size={14} />

						<span>
							{new Date(updatedAt).toLocaleDateString()}
						</span>

					</div>

				</div>
			</div>
		</div>
	);
};

export default ProjectCard;
