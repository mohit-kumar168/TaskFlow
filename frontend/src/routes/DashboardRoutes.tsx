import Dashboard from "@/pages/Dashboard";
import ProtectedRoute from "./ProtectedRoute";

export const DashboardRoutes = [
	{
		element: <ProtectedRoute />,
		children: [
			{
				path: "/dashboard",
				element: <Dashboard />,
			},
		],
	},
];
