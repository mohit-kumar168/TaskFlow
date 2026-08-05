import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
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
