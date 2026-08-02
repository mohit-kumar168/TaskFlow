import { createBrowserRouter } from "react-router-dom";
import { AuthRoutes } from "./AuthRoutes";

export const router = createBrowserRouter([
	...AuthRoutes,
]);
