import apiError from "@/utils/apiError";
import * as authRepository from "./auth.repository";
import { OAuth2Client } from "google-auth-library";

import type {
  RegisterWithCredentialsInput,
  LoginWithCredentialsInput,
  GoogleLoginInput,
  ChangePasswordInput,
  UpdateProfileInput,
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
import env from "@/config/env";

const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);

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
  await authRepository.clearUserRefreshTokens(userId);
};

export const loginWithGoogle = async (data: GoogleLoginInput) => {
  let payload;

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: data.credential,
      audience: env.GOOGLE_CLIENT_ID,
    });

    payload = ticket.getPayload();
  } catch {
    throw new apiError(
      401,
      "Invalid Google credential."
    );
  }

  if (
    !payload ||
    !payload.sub ||
    !payload.email ||
    !payload.email_verified
  ) {
    throw new apiError(
      401,
      "Unable to verify Google account."
    );
  }

  const googleId = payload.sub;
  const email = payload.email.toLowerCase();

  let googleAccount =
    await authRepository.findGoogleAccount(googleId);

  let user;

  if (googleAccount) {
    user = googleAccount.user;

    if (!user.isActive) {
      throw new apiError(
        401,
        "This account has been deactivated."
      );
    }
  } else {
    const existingUser = await authRepository.findUserByEmail(email);

    if (existingUser) {
      if (!existingUser.isActive) {
        throw new apiError(
          401,
          "This account has been deactivated."
        );
      }

      googleAccount =
        await authRepository.createGoogleAccount(
          existingUser.id,
          googleId
        );

      user = existingUser;
    } else {
      if (!payload.name) {
        throw new apiError(
          400,
          "Google account name is required."
        );
      }
      user = await authRepository.createGoogleUser({
        name: payload.name,
        email,
        avatarUrl: payload.picture,
        providerAccountId: googleId,
      });

      googleAccount = await authRepository.findGoogleAccount(
        googleId
      );
    }
  }

  if (!googleAccount) {
    throw new apiError(
      500,
      "Google account could not be created."
    );
  }

  const accessToken = generateAccessToken(user.id);

  const refreshToken = generateRefreshToken(user.id);

  const hashedRefreshToken = await generateHash(refreshToken);

  await authRepository.updateAccountRefreshToken(
    googleAccount.id,
    hashedRefreshToken
  );

  return {
    user,
    accessToken,
    refreshToken,
  };
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
  } catch {
    throw new apiError(
      401,
      "Invalid or expired refreshToken."
    );
  }

  const accounts =
    await authRepository.findAccountByUserId(payload.id);

  let validAccount = null;

  for (const account of accounts) {
    if (!account.hashedRefreshToken) {
      continue;
    }

    const isValid = await compareHash(
      refreshToken,
      account.hashedRefreshToken
    );

    if (isValid) {
      validAccount = account;
      break;
    }
  }

  if (!validAccount) {
    throw new apiError(
      401,
      "Unauthorized request."
    );
  }

  const newAccessToken =
    generateAccessToken(validAccount.userId);

  const newRefreshToken =
    generateRefreshToken(validAccount.userId);

  const hashedRefreshToken =
    await generateHash(newRefreshToken);

  await authRepository.updateAccountRefreshToken(
    validAccount.id,
    hashedRefreshToken
  );

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    user: validAccount.user,
  };
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
