import DashboardLayout from "@/layouts/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "@/pages/Dashboard";

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
				]
			},
		],
	},
];
