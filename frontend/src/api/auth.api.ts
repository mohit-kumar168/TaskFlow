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

export interface UserProps {
  id: string;
  name: string;
  email: string;
  bio?: string | null;
  avatarUrl?: string | null;
}

export interface UpdateUserProfileProps {
  name?: string;
  bio?: string;
  avatar?: File;
}

export interface ChangePasswordProps {
  currentPassword: string;
  newPassword: string;
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

export const updateUserProfile = (data: UpdateUserProfileProps) => {
  const formData = new FormData();

  if (data.name !== undefined) {
    formData.append("name", data.name);
  }

  if (data.bio !== undefined) {
    formData.append("bio", data.bio);
  }

  if (data.avatar) {
    formData.append("avatar", data.avatar);
  }
  return api.patch("/auth/update-profile", formData);
};

export const changeUserPassword = (data: ChangePasswordProps) => {
  return api.patch("/auth/change-password", data);
};

export const deleteUserAccount = () => {
  return api.delete("/auth/delete-user");
};
