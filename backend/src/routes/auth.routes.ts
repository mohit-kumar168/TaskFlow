import { getCurrentUser, loginUser, logoutUser, refreshAccessToken, registerUser } from "@/controllers/auth.controller";
import { protect } from "@/middleware/auth.middleware";
import { Router } from "express";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshAccessToken);
router.post("/logout", protect, logoutUser);
router.get("/me", getCurrentUser);

export default router;
