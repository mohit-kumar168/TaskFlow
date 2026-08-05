import DashboardLayout from "@/layouts/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "@/pages/dashboard/Dashboard";
import CreateWorkspace from "@/pages/workspace/CreateWorkspace";
import CreateProject from "@/pages/project/CreateProject";
import ProjectPage from "@/pages/project/ProjectPage";
import WorkspacePage from "../pages/workspace/WorkspacePage";
import WorkspaceLayout from "../layouts/WorkspaceLayout";

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
								path: ":workspaceSlug",
								element: <WorkspaceLayout />,
								children: [
									{
										index: true,
										element: <WorkspacePage />,
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
