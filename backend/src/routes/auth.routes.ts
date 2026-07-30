import { getCurrentUser, loginUser, logoutUser, refreshAccessToken, registerUser } from "@/controllers/auth.controller";
import { protect } from "@/middleware/auth.middleware";
import { Router } from "express";

const authRouter = Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/refresh-token", refreshAccessToken);
authRouter.post("/logout", protect, logoutUser);
authRouter.get("/me", getCurrentUser);

export default authRouter;
