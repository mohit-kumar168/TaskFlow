import DashboardLayout from "@/layouts/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "@/pages/dashboard/Dashboard";
import CreateWorkspace from "@/pages/workspace/CreateWorkspace";
import CreateProject from "@/pages/project/CreateProject";
import ProjectPage from "@/pages/project/ProjectPage";
import WorkspaceOverview from "../pages/workspace/WorkspaceOverview";
import WorkspaceLayout from "../layouts/WorkspaceLayout";
import WorkspaceMembers from "@/pages/workspace/WorkspaceMembers";
import ProjectLayout from "@/layouts/ProjectLayout";
import ProjectBoard from "@/components/project/ProjectBoard";
import ProjectMembers from "@/components/project/ProjectMembers";

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
