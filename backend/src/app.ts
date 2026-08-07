import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import errorMiddleware from "./middleware/error.middleware";
import authRouter from "./modules/auth/auth.routes";
import workspaceRoutes from "./modules/workspaces/workspace.routes";
import projectRoutes from "./modules/projects/project.routes";
import issueRoutes from "./modules/issues/issue.routes";

const app = express();

app.use(cors({
	origin: process.env.FRONTEND_URL,
	credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/workspace", workspaceRoutes);
app.use("/workspaces", projectRoutes);
app.use("/projects", issueRoutes);


app.use(errorMiddleware);

export default app;
