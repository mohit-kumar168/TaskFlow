import { api } from "./axios";

export interface RegisterUserProps {
	name: string;
	email: string;
	password: string;
}

export interface LoginUserProps {
	email: string;
	password: string;
}

export const registerUser = (data: RegisterUserProps) => {
	return api.post("/api/auth/register", data);
};

export const loginUser = (data: LoginUserProps) => {
	return api.post("/api/auth/login", data);
};

export const refreshAccessToken = () => {
	return api.post("/api/auth/refresh-token");
};

export const logoutUser = () => {
	return api.post("/api/auth/logout");
};

export const getCurrentUser = () => {
	return api.get("/api/auth/me");
};
