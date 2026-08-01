import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import errorMiddleware from "./middleware/error.middleware";
import authRouter from "./routes/auth.routes";
import workspaceRoutes from "./routes/workspace.routes";
import projectRoutes from "./routes/project.routes";
import issueRoutes from "./routes/issue.routes";

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/workspace", workspaceRoutes);
app.use("/workspaces", projectRoutes);
app.use("/projects", issueRoutes);


app.use(errorMiddleware);

export default app;
