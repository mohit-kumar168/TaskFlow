import { useProjectStore } from "../../../store/project.store";
import Button from "../../../components/ui/Button";
import ProjectCard from "./ProjectCard";
import { useNavigate, useParams } from "react-router";


const ProjectGrid = () => {
	const { organizationSlug, workspaceSlug } = useParams<{
		organizationSlug: string;
		workspaceSlug: string;
	}>();
	const { projects, isLoading } = useProjectStore();
	const navigate = useNavigate();
	if (isLoading) {
		return (
			<div className="text-center py-10">
				Loading Projects...
			</div>
		);
	}

	if (projects.length === 0) {
		return (
			<div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">

				<h3 className="text-xl font-semibold text-gray-800">
					No Projects Yet
				</h3>

				<p className="mt-2 text-gray-500">
					Create your first project to start managing work.
				</p>

				<Button onClick={() => navigate(`/organizations/${organizationSlug}/workspaces/${workspaceSlug}/projects/create`)} className="mx-auto mt-6 md:w-56">
					Create Project
				</Button>

			</div>
		);
	}

	return (
		<div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
			{projects.map((project) => (
				<ProjectCard
					key={project.key}
					id={project.id}
					projectSlug={project.slug}
					name={project.name}
					description={project.description}
					memberCount={project._count?.members ?? 0}
					issueCount={project._count?.issues ?? 0}
					updatedAt={project.updatedAt}
				/>
			))}
		</div>
	);
};

export default ProjectGrid;
