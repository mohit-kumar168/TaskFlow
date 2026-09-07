import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import errorMiddleware from "./middleware/error.middleware";
import authRoutes from "./modules/auth/auth.routes";
import organizationRoutes from "./modules/organization/organization.routes";
import workspaceRoutes from "./modules/workspaces/workspace.routes";
import projectRoutes from "./modules/projects/project.routes";
import issueRoutes from "./modules/issues/issue.routes";
import commentRoutes from "./modules/comments/comment.routes";
import sprintRoutes from "./modules/sprints/sprint.routes";
import notificationRoutes from "./modules/notifications/notification.routes";
import reportRoutes from "./modules/reports/report.routes";

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  }),
);
app.use(cookieParser());

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/organizations",
  organizationRoutes
);

app.use(
  "/api/organizations/:organizationSlug/workspaces",
  workspaceRoutes
);

app.use(
  "/api/organizations/:organizationSlug/workspaces/:workspaceSlug/projects",
  projectRoutes
);

app.use(
  "/api/organizations/:organizationSlug/workspaces/:workspaceSlug/projects/:projectSlug/issues",
  issueRoutes
);

app.use(
  "/api/organizations/:organizationSlug/workspaces/:workspaceSlug/projects/:projectSlug/issues/:issueId/comments",
  commentRoutes,
);

app.use(
  "/api/organizations/:organizationSlug/workspaces/:workspaceSlug/projects/:projectSlug/sprints",
  sprintRoutes,
);

app.use(
  "/api/notifications",
  notificationRoutes,
);

app.use(
  "/api/organizations/:organizationSlug/workspaces/:workspaceSlug/projects/:projectSlug/reports",
  reportRoutes,
);

app.use(errorMiddleware);

export default app;
