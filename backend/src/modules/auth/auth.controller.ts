import type { Request, Response } from "express";
import asyncHandler from "@/utils/asyncHandler";
import apiResponse from "@/utils/apiResponse";
import apiError from "@/utils/apiError";
import {
  ACCESS_TOKEN_COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE_OPTIONS
} from "@/constants/auth.constants";
import * as authService from "./auth.service";

export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.registerWithCredentials(req.body);

  res.cookie("accessToken", result.accessToken, ACCESS_TOKEN_COOKIE_OPTIONS);
  res.cookie("refreshToken", result.refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);


  return res.status(201).json(
    new apiResponse(
      "User registred successfully.",
      result,
    ),
  );
});

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.loginWithCredentials(req.body);

  res.cookie("accessToken", result.accessToken, ACCESS_TOKEN_COOKIE_OPTIONS);
  res.cookie("refreshToken", result.refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

  return res.status(200).json(
    new apiResponse(
      "Login successful.",
      result,
    ),
  );
});

export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  await authService.logout(req.user!.id);

  res.clearCookie("accessToken", ACCESS_TOKEN_COOKIE_OPTIONS);
  res.clearCookie("refreshToken", REFRESH_TOKEN_COOKIE_OPTIONS);

  return res.status(200).json(
    new apiResponse(
      "Logout successful.",
      null,
    ),
  );
});

export const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new apiError(401, "Unauthorized request.");
  }

  const result = await authService.refreshAccessToken(refreshToken);

  res.cookie("accessToken", result.accessToken, ACCESS_TOKEN_COOKIE_OPTIONS);
  res.cookie("refreshToken", result.refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

  return res.status(200).json(
    new apiResponse(
      "Access token refreshed successfully.",
      {
        user: result.user,
      }
    ),
  )
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.getCurrentUser(req.user!.id);

  return res.status(200).json(
    new apiResponse(
      "User fetched successfully.",
      result,
    ),
  );
});

export const changeUserPassword = asyncHandler(async (req: Request, res: Response) => {
  await authService.changePassword(req.user!.id, req.body);

  return res.status(200).json(
    new apiResponse(
      "Password changed successfully.",
      null,
    ),
  );
});

export const updateUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.updateProfile(req.user!.id, req.body, req.file);
  return res.status(200).json(
    new apiResponse(
      "User profile update successful.",
      user,
    ),
  );
});

export const removeUser = asyncHandler(async (req: Request, res: Response) => {
  await authService.removeUser(req.user!.id);

  res.clearCookie("accessToken", ACCESS_TOKEN_COOKIE_OPTIONS);
  res.clearCookie("refreshToken", REFRESH_TOKEN_COOKIE_OPTIONS);

  return res.status(200).json(
    new apiResponse(
      "User profile update successful.",
      null,
    ),
  );
});
