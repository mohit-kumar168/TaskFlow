import { useAuthStore } from "@/store/auth.store";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
	const { isAuthenticated, isLoading } = useAuthStore();

	if (isLoading) {
		return <h1>Loading...</h1>;
	};

	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}
	return <Outlet />;
}

export default ProtectedRoute;
