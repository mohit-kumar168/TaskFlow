import { createBrowserRouter } from "react-router-dom";
import { AuthRoutes } from "./AuthRoutes";
import { DashboardRoutes } from "./DashboardRoutes";

export const router = createBrowserRouter([
	...AuthRoutes,
	...DashboardRoutes,
]);
