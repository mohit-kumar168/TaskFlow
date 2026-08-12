import Login from "@/modules/auth/pages/Login";
import Register from "@/modules/auth/pages/Register";
import { Navigate } from "react-router-dom";

export const AuthRoutes = [
	{
		path: "/",
		element: <Navigate to="/login" replace />,
	},
	{
		path: "/login",
		element: <Login />
	},
	{
		path: "/register",
		element: <Register />
	},
]
