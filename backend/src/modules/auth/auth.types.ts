export interface RegisterWithCredentialsInput {
	name: string;
	email: string;
	password: string;
	bio?: string;
	avatarUrl?: string;
}

export interface LoginWithCredentialsInput {
	email: string;
	password: string;
}

export interface ChangePasswordInput {
	currentPassword: string;
	newPassword: string;
}
