import DashboardLayout from "@/layouts/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "@/pages/dashboard/Dashboard";
import CreateWorkspace from "@/pages/workspace/CreateWorkspace";
import CreateProject from "@/pages/project/CreateProject";
import ProjectPage from "@/pages/project/ProjectPage";
import WorkspaceOverview from "../pages/workspace/WorkspaceOverview";
import WorkspaceLayout from "../layouts/WorkspaceLayout";
import WorkspaceMembers from "@/pages/workspace/WorkspaceMembers";

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
									{
										path: "projects/create",
										element: <CreateProject />,
									},
									{
										path: "projects/:projectKey",
										element: <ProjectPage />,
									},
								],
							}
						]
					}
				]
			},
		],
	},
];
