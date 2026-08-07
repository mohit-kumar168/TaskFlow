import { getCurrentUser, loginUser, logoutUser, refreshAccessToken, registerUser, changePassword } from "./auth.controller";
import { protect } from "@/middleware/auth.middleware";
import { Router } from "express";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshAccessToken);
router.post("/logout", protect, logoutUser);
router.get("/me", protect, getCurrentUser);
router.get("/change-password", changePassword);

export default router;
