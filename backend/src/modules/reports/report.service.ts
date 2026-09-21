import apiError from "@/utils/apiError";
import logger from "@/config/logger";

import * as sprintRepository from "@/modules/sprints/sprint.repository";
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
  const organization =
    await organizationRepository.findOrganizationBySlug(
      organizationSlug,
      userId,
    );

  if (!organization) {
    throw new apiError(404, "Organization not found");
  }

  const workspace =
    await workspaceRepository.findWorkspaceBySlug(
      organization.id,
      workspaceSlug,
      userId,
    );

  if (!workspace) {
    throw new apiError(404, "Workspace not found");
  }

  const project =
    await projectRepository.findProjectBySlug(
      workspace.id,
      userId,
      projectSlug,
    );

  if (!project) {
    throw new apiError(404, "Project not found");
  }

  const projectMember =
    await projectRepository.findProjectMemberByUserId(
      project.id,
      userId,
    );

  if (!projectMember) {
    throw new apiError(
      403,
      "You don't have access to this project",
    );
  }

  return project;
};

export const fetchIssueStatusReport = async (
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

  const issues = await reportRepository.fetchProjectIssues(project.id);

  const statusMap = new Map<string, number>();

  for (const issue of issues) {
    const status = issue.status;

    statusMap.set(
      status,
      (statusMap.get(status) ?? 0) + 1,
    );
  }

  const report = Array.from(statusMap.entries()).map(
    ([status, count]) => ({
      status,
      count,
    }),
  );

  logger.debug({ projectId: project.id, rows: report.length }, "Issue status report generated");
  return report;
};

export const fetchIssuePriorityReport = async (
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

  const issues = await reportRepository.fetchProjectIssues(project.id);

  const priorityMap = new Map<string, number>();

  for (const issue of issues) {
    priorityMap.set(
      issue.priority,
      (priorityMap.get(issue.priority) ?? 0) + 1,
    );
  }

  const report = Array.from(priorityMap.entries()).map(
    ([priority, count]) => ({
      priority,
      count,
    }),
  );

  logger.debug({ projectId: project.id, rows: report.length }, "Issue priority report generated");
  return report;
};

export const fetchIssueTrendReport = async (
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

  const issues = await reportRepository.fetchProjectIssues(project.id);

  const trendMap = new Map<string, number>();

  for (const issue of issues) {
    const date = issue.createdAt
      .toISOString()
      .slice(0, 10);

    trendMap.set(
      date,
      (trendMap.get(date) ?? 0) + 1,
    );
  }

  const report = Array.from(trendMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({
      date,
      count,
    }));

  logger.debug({ projectId: project.id, rows: report.length }, "Issue trend report generated");
  return report;
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
    await sprintRepository.fetchAllSprints(
      project.id,
    );

  const sprintReports = await Promise.all(
    sprints.map(async (sprint) => {
      const issues =
        await sprintRepository.fetchSprintIssues(
          project.id,
          sprint.id,
        );

      const totalIssues = issues.length;

      const completedIssues = issues.filter(
        (issue) => issue.status === "DONE",
      ).length;

      const remainingIssues =
        totalIssues - completedIssues;

      const progress =
        totalIssues === 0
          ? 0
          : Math.round(
            (completedIssues / totalIssues) * 100,
          );

      return {
        sprintId: sprint.id,
        sprintName: sprint.name,
        totalIssues,
        completedIssues,
        remainingIssues,
        progress,
      };
    }),
  );

  return sprintReports;
};
