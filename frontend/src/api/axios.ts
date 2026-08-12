import axios from "axios";

export const api = axios.create({
	baseURL: process.env.BUN_PUBLIC_BASE_URL,
	withCredentials: true,
})

api.interceptors.response.use(
	(response) => response,

	async (error) => {
		const originalRequest = error.config;

		if (
			error.response?.status === 401 &&
			!originalRequest._retry
		) {
			originalRequest._retry = true;

			try {
				await api.post("/auth/refresh");

				return api(originalRequest);
			} catch (refreshError) {
				return Promise.reject(refreshError);
			}
		}

		return Promise.reject(error);
	}
);
