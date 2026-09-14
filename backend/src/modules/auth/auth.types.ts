export interface RegisterWithCredentialsInput {
  name: string;
  email: string;
  password: string;
  bio?: string;
}

export interface LoginWithCredentialsInput {
  email: string;
  password: string;
}

export interface GoogleLoginInput {
  credential: string;
}

export interface CreateGoogleUserInput {
  name: string;
  email: string;
  avatarUrl?: string;
  providerAccountId: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfileInput {
  name?: string;
  bio?: string;
  avatarUrl?: string;
}
