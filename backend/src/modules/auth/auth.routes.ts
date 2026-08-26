import { getMe, loginUser, logoutUser, refreshAccessToken, registerUser, changeUserPassword, updateUserProfile, removeUser } from "./auth.controller";
import { protect } from "@/middleware/auth.middleware";
import validateRequest from "@/middleware/validateRequest.middleware";
import { Router } from "express";
import { changePasswordSchema, loginUserSchema, registerUserSchema, updateProfileSchema } from "./auth.validator";
import upload from "@/middleware/upload.middleware";

const router = Router();

router.post(
  "/register",
  validateRequest(registerUserSchema),
  registerUser
);

router.post(
  "/login",
  validateRequest(loginUserSchema),
  loginUser
);

router.post(
  "/refresh-token",
  refreshAccessToken
);

router.post(
  "/logout",
  protect,
  logoutUser
);

router.get(
  "/me",
  protect,
  getMe
);

router.patch(
  "/change-password",
  protect,
  validateRequest(changePasswordSchema),
  changeUserPassword
);

router.patch(
  "/update-profile",
  protect,
  upload.single("avatar"),
  validateRequest(updateProfileSchema),
  updateUserProfile
);

router.delete(
  "/delete-user",
  protect,
  removeUser
);

export default router;
