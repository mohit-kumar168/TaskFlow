import { create } from "zustand";

interface User {
	id: string;
	name: string;
	email: string;
}

interface AuthStore {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;

	setUser: (user: User) => void;
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
