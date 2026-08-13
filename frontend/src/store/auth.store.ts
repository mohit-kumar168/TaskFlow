import { create } from "zustand";
import type { UserProps } from "@/api/auth.api";

interface AuthStore {
	user: UserProps | null;
	isAuthenticated: boolean;
	isLoading: boolean;

	setUser: (user: UserProps) => void;
	logout: () => void;
	setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
	user: null,
	isAuthenticated: false,
	isLoading: true,

	setUser: (user) => set({
		user,
		isAuthenticated: true,
	}),

	logout: () => set({
		user: null,
		isAuthenticated: false,
		isLoading: false,
	}),
	setLoading: (loading) => set({
		isLoading: loading,
	}),
}));
