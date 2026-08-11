import DashboardLayout from "@/layouts/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "@/modules/dashboard/pages/Dashboard";
import CreateWorkspace from "@/modules/workspace/pages/CreateWorkspace";
import CreateProject from "@/modules/project/pages/CreateProject";
import ProjectPage from "@/modules/project/pages/ProjectPage";
import WorkspaceOverview from "../modules/workspace/pages/WorkspaceOverview";
import WorkspaceLayout from "../layouts/WorkspaceLayout";
import WorkspaceMembers from "@/modules/workspace/pages/WorkspaceMembers";
import ProjectLayout from "@/layouts/ProjectLayout";
import ProjectBoard from "@/modules/project/components/ProjectBoard";
import ProjectMembers from "@/modules/project/components/ProjectMembers";

export const DashboardRoutes = [
	{
		element: <ProtectedRoute />,
		children: [
			{
				element: <DashboardLayout />,
				children: [
					{
						path: "/dashboard",
						element: <Dashboard />
					},
					{
						path: "/workspaces",
						children: [
							{
								path: "create",
								element: <CreateWorkspace />
							},
							{
								path: ":workspaceId",
								element: <WorkspaceLayout />,
								children: [
									{
										index: true,
										element: <WorkspaceOverview />,
									},
									{
										path: "members",
										element: <WorkspaceMembers />,
									},
								],
							},
							{
								path: ":workspaceId/projects/:projectId",
								element: <ProjectLayout />,
								children: [
									{
										index: true,
										element: <ProjectBoard />
									},
									{
										path: "members",
										element: <ProjectMembers />
									},
								]
							}
						]
					}
				]
			},
		],
	},
];
