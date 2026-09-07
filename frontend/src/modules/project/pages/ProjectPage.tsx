import { FolderKanban, Users } from "lucide-react";
import { useParams } from "react-router-dom";
import { useProjectStore } from "@/store/project.store";
import Reports from "@/modules/reports/components/Reports";

const ProjectPage = () => {
  const {
    organizationSlug,
    workspaceSlug,
    projectSlug,
  } = useParams<{
    organizationSlug: string;
    workspaceSlug: string;
    projectSlug: string;
  }>();


  const { currentProject } = useProjectStore();

  if (!currentProject) {
    return null;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Overview
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Overview of your project and its activity.
        </p>
      </div>

      {/* Project summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
            <FolderKanban size={18} />
          </div>

          <p className="text-sm text-gray-500">
            Issues
          </p>

          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {currentProject._count?.issues ?? 0}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
            <Users size={18} />
          </div>

          <p className="text-sm text-gray-500">
            Members
          </p>

          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {currentProject._count?.members ?? 0}
          </p>
        </div>
      </div>

      {/* Reports */}
      <div className="mt-8">
        <Reports
          organizationSlug={organizationSlug!}
          workspaceSlug={workspaceSlug!}
          projectSlug={projectSlug!}
        />
      </div>
    </div>
  );
};

export default ProjectPage;
