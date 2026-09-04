import apiError from "@/utils/apiError";
import * as authRepository from "./auth.repository";

import type {
  RegisterWithCredentialsInput,
  LoginWithCredentialsInput,
  ChangePasswordInput,
  UpdateProfileInput
} from "./auth.types";

import {
  compareHash,
  generateHash
} from "@/utils/password";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} from "@/utils/jwt";
import { getUserFolder, uploadToCloudinary } from "@/utils/cloudinary";

export const registerWithCredentials = async (data: RegisterWithCredentialsInput) => {
  const existingUser = await authRepository.findUserByEmail(data.email);
  if (existingUser) {
    throw new apiError(400, "User with this email already exists.");
  }

  const passwordHash = await generateHash(data.password);

  const user = await authRepository.createUserWithCredentials(data, passwordHash);

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  const hashRefreshToken = await generateHash(refreshToken);

  const account = await authRepository.findCredentialsAccount(user.id);

  if (!account) {
    throw new apiError(500, "Credentials account not found.");
  }

  await authRepository.updateRefreshToken(user.id, hashRefreshToken);

  return { user, accessToken, refreshToken };
};

export const loginWithCredentials = async (data: LoginWithCredentialsInput) => {
  const user = await authRepository.findUserByEmail(data.email);
  if (!user || !user.isActive) {
    throw new apiError(401, "Invalid email or password.");
  }

  const account = user.accounts.find(account => account.provider === "CREDENTIALS");

  if (!account || !account.passwordHash) {
    throw new apiError(401, "Invalid email or password.");
  }

  const isPasswordValid = await compareHash(data.password, account.passwordHash);

  if (!isPasswordValid) {
    throw new apiError(401, "Invalide email or password.");
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  const hashRefreshToken = await generateHash(refreshToken);

  await authRepository.updateRefreshToken(user.id, hashRefreshToken);

  return { user, accessToken, refreshToken };
};

export const logout = async (userId: string) => {
  const account = await authRepository.findCredentialsAccount(userId);
  if (!account) {
    throw new apiError(404, "Account not found.");
  }

  await authRepository.updateRefreshToken(userId, null);
};

export const changePassword = async (userId: string, data: ChangePasswordInput) => {
  const account = await authRepository.findCredentialsAccount(userId);
  if (!account || !account.passwordHash) {
    throw new apiError(404, "Account not found");
  }
  const isPasswordValid = await compareHash(data.currentPassword, account.passwordHash);
  if (!isPasswordValid) {
    throw new apiError(401, "Password is incorrect.");
  }

  const hashNewPassword = await generateHash(data.newPassword);
  await authRepository.updatePassword(account.id, hashNewPassword);
};

export const refreshAccessToken = async (refreshToken: string) => {
  let payload;

  try {
    payload = verifyRefreshToken(refreshToken);
  } catch (error) {
    throw new apiError(401, "Invalid or expired refreshToken.");
  }

  const account = await authRepository.findCredentialsAccount(payload.id);
  if (!account || !account.hashedRefreshToken) {
    throw new apiError(401, "Unauthorized request.");
  }

  const isValid = await compareHash(refreshToken, account.hashedRefreshToken);
  if (!isValid) {
    throw new apiError(401, "Unauthorized request.");
  }

  const newAccessToken = generateAccessToken(account.userId);
  const newRefreshToken = generateRefreshToken(account.userId);

  const hashRefreshToken = await generateHash(newRefreshToken);

  await authRepository.updateRefreshToken(account.userId, hashRefreshToken);

  return { accessToken: newAccessToken, refreshToken: newRefreshToken, user: account.user };
};

export const getCurrentUser = async (userId: string) => {
  const user = await authRepository.findUserById(userId);
  if (!user) {
    throw new apiError(404, "User not found");
  }

  return user;
};

export const updateProfile = async (
  userId: string,
  data: UpdateProfileInput,
  file?: Express.Multer.File,
) => {
  const user = await authRepository.findUserById(userId);

  if (!user) {
    throw new apiError(404, "User not found.");
  }

  let avatarUrl;

  console.log("Before Cloudinary upload");

  if (file) {
    const uploadImage =
      await uploadToCloudinary(
        file.buffer,
        {
          folder: getUserFolder(userId),
          publicId: "avatar",
          resourceType: "image",
        },
      );
    console.log("Cloudinary result:", uploadImage);

    avatarUrl = uploadImage.url;
  }

  const updatedUser = await authRepository.updateProfile(
    userId,
    {
      ...data,
      avatarUrl,
    },
  );

  return { user: updatedUser };
};

export const removeUser = async (userId: string) => {
  const user = await authRepository.findUserById(userId);

  if (!user) {
    throw new apiError(404, "User not found.");
  }

  await authRepository.removeUser(userId);
};
