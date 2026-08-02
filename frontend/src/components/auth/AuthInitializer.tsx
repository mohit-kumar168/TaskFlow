import { getCurrentUser } from "@/api/auth.api";
import { useAuthStore } from "@/store/auth.store";
import { useEffect } from "react";

const AuthInitializer = () => {
	const { setUser, logout, setLoading } = useAuthStore();

	useEffect(() => {
		const initializeAuth = async () => {
			try {
				const response = await getCurrentUser();
				setUser(response.data.data);
			} catch (error) {
				console.log(error);
				logout();
			} finally {
				setLoading(false);
			}
		};

		initializeAuth();
	}, [])
	return null;
};

export default AuthInitializer;
