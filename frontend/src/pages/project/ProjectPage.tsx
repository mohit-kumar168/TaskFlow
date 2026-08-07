import { useProjectStore } from "@/store/project.store";
import { useEffect } from "react";
import { useParams } from "react-router-dom"

const ProjectPage = () => {
	const { workspaceId, projectId } = useParams();
	const { currentProject, fetchProject } = useProjectStore();

	useEffect(() => {
		if (workspaceId && projectId) {
			fetchProject(workspaceId, projectId);
		}
	}, [workspaceId, projectId]);
	return (
		<div>ProjectPage</div>
	)
}

export default ProjectPage
