import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";

import Dashboard from "@/modules/dashboard/pages/Dashboard";

import CreateOrganization from "@/modules/organization/pages/CreateOrganization";

import CreateWorkspace from "@/modules/workspace/pages/CreateWorkspace";
import WorkspaceLayout from "@/layouts/WorkspaceLayout";
import WorkspaceOverview from "@/modules/workspace/pages/WorkspaceOverview";
import WorkspaceMembers from "@/modules/workspace/pages/WorkspaceMembers";
import WorkspaceSettings from "@/modules/workspace/pages/WorkspaceSettings";

import CreateProject from "@/modules/project/pages/CreateProject";
import ProjectLayout from "@/layouts/ProjectLayout";
import ProjectBoard from "@/modules/project/pages/ProjectBoard";
import ProjectMembers from "../modules/project/components/ProjectMembers";
import ProjectPage from "@/modules/project/pages/ProjectPage";
import UserSetting from "@/modules/dashboard/pages/UserSetting";
import OrganizationSetting from "@/modules/organization/pages/OrganizationSetting";
import AcceptInvitation from "@/modules/organization/components/AcceptInvitation";
import DashboardSearchPage from "../modules/dashboard/pages/DashboardSearchPage";
import ProjectSprints from "../modules/issue/pages/ProjectSprints";

export const DashboardRoutes = [
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            path: "/invitations/:token",
            element: <AcceptInvitation />,
          },
          {
            path: "/dashboard",
            element: <Dashboard />,
          },
          {
            path: "/dashboard/search",
            element: <DashboardSearchPage />,
          },
          {
            path: "/settings",
            element: <UserSetting />,
          },
          {
            path: "/organizations/create",
            element: <CreateOrganization />,
          },
          {
            path: "/organizations/:organizationSlug/settings",
            element: <OrganizationSetting />,
          },
          {
            path: "/organizations/:organizationSlug/workspaces",
            children: [
              {
                path: "create",
                element: <CreateWorkspace />,
              },

              {
                path: ":workspaceSlug",
                element: <WorkspaceLayout />,
                children: [
                  {
                    index: true,
                    element: <WorkspaceOverview />,
                  },

                  {
                    path: "members",
                    element: <WorkspaceMembers />,
                  },

                  {
                    path: "projects/create",
                    element: <CreateProject />,
                  },
                ],
              },
              {
                path: ":workspaceSlug/settings",
                element: <WorkspaceSettings />,
              },
            ],
          },
          {
            path: "/organizations/:organizationSlug/workspaces/:workspaceSlug/projects/:projectSlug",
            element: <ProjectLayout />,
            children: [
              {
                index: true,
                element: <ProjectPage />,
              },

              {
                path: "board",
                element: <ProjectBoard />,
              },

              {
                path: "sprints",
                element: <ProjectSprints />,
              },

              {
                path: "members",
                element: <ProjectMembers />,
              },
            ],
          },
        ],
      },
    ],
  },
];
