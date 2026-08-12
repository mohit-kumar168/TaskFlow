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
	return api.post("/auth/register", data);
};

export const loginUser = (data: LoginUserProps) => {
	return api.post("/auth/login", data);
};

export const refreshAccessToken = () => {
	return api.post("/auth/refresh-token");
};

export const logoutUser = () => {
	return api.post("/auth/logout");
};

export const getCurrentUser = () => {
	return api.get("/auth/me");
};
