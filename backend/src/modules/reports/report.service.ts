import apiError from "@/utils/apiError";

import * as reportRepository from "./report.repository";
import * as organizationRepository from "@/modules/organization/organization.repository";
import * as workspaceRepository from "@/modules/workspaces/workspace.repository";
import * as projectRepository from "@/modules/projects/project.repository";

const getProject = async (
  organizationSlug: string,
  workspaceSlug: string,
  projectSlug: string,
  userId: string,
) => {
  const organization = await organizationRepository.findOrganizationBySlug(organizationSlug, userId);

  if (!organization) {
    throw new apiError(404, "Organization not found");
  }

  const workspace = await workspaceRepository.findWorkspaceBySlug(organization.id, workspaceSlug, userId);

  if (!workspace) {
    throw new apiError(404, "Workspace not found");
  }

  const project = await projectRepository.findProjectBySlug(workspace.id, userId, projectSlug);

  if (!project) {
    throw new apiError(404, "Project not found");
  }

  const projectMember = await projectRepository.findProjectMemberByUserId(project.id, userId);

  if (!projectMember) {
    throw new apiError(403, "You don't have access to this project");
  }

  return project;
};

export const fetchIssueStatusReport = async (
  organizationSlug: string,
  workspaceSlug: string,
  projectSlug: string,
  userId: string,
) => {
  const project = await getProject(organizationSlug, workspaceSlug, projectSlug, userId);

  const result = await reportRepository.fetchIssueStatusReport(project.id);

  return result.map((item) => ({
    status: item.status,
    count: item._count._all,
  }));
};

export const fetchIssuePriorityReport = async (
  organizationSlug: string,
  workspaceSlug: string,
  projectSlug: string,
  userId: string,
) => {
  const project = await getProject(organizationSlug, workspaceSlug, projectSlug, userId);

  const result = await reportRepository.fetchIssuePriorityReport(project.id);

  return result.map((item) => ({
    priority: item.priority,
    count: item._count._all,
  }));
};

export const fetchIssueTrendReport = async (
  organizationSlug: string,
  workspaceSlug: string,
  projectSlug: string,
  userId: string,
) => {
  const project = await getProject(organizationSlug, workspaceSlug, projectSlug, userId);

  const issues = await reportRepository.fetchIssueTrendReport(project.id);

  const trend = new Map<string, number>();

  for (const issue of issues) {
    const date = issue.createdAt.toISOString().slice(0, 10);

    trend.set(date, (trend.get(date) ?? 0) + 1);
  }

  return Array.from(trend.entries()).map(
    ([date, count]) => ({
      date,
      count,
    })
  );
};

export const fetchSprintProgressReport = async (
  organizationSlug: string,
  workspaceSlug: string,
  projectSlug: string,
  userId: string,
) => {
  const project = await getProject(
    organizationSlug,
    workspaceSlug,
    projectSlug,
    userId,
  );

  const sprints =
    await reportRepository.fetchSprintProgressReport(
      project.id,
    );

  return sprints.map((sprint) => {
    const totalIssues =
      sprint.issues.length;

    const completedIssues =
      sprint.issues.filter(
        (issue) => issue.status === "DONE",
      ).length;

    const remainingIssues =
      totalIssues - completedIssues;

    const progress =
      totalIssues === 0
        ? 0
        : Math.round(
          (completedIssues /
            totalIssues) *
          100,
        );

    return {
      sprintId: sprint.id,
      sprintName: sprint.name,
      totalIssues,
      completedIssues,
      remainingIssues,
      progress,
    };
  });
};
