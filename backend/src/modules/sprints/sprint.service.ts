import apiError from "@/utils/apiError";

import {
  ProjectRole,
  SprintStatus,
} from "@/generated/prisma/enums";

import type {
  CompleteSprintInput,
  CreateSprintInput,
} from "./sprint.types";

import * as sprintRepository from "./sprint.repository";
import * as projectRepository from "@/modules/projects/project.repository";
import * as workspaceRepository from "@/modules/workspaces/workspace.repository";
import * as organizationRepository from "@/modules/organization/organization.repository";

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
    throw new apiError(404, "Organization not found.");
  }

  const workspace =
    await workspaceRepository.findWorkspaceBySlug(
      organization.id,
      workspaceSlug,
      userId,
    );

  if (!workspace) {
    throw new apiError(404, "Workspace not found.");
  }

  const project =
    await projectRepository.findProjectBySlug(
      workspace.id,
      userId,
      projectSlug,
    );

  if (!project) {
    throw new apiError(404, "Project not found.");
  }

  return project;
};

const requireProjectMember = async (
  projectId: string,
  userId: string,
) => {
  const member =
    await projectRepository.findProjectMemberByUserId(
      projectId,
      userId,
    );

  if (!member) {
    throw new apiError(
      403,
      "You don't have access to this project.",
    );
  }

  return member;
};

const requireProjectAdmin = async (
  projectId: string,
  userId: string,
) => {
  const member = await requireProjectMember(
    projectId,
    userId,
  );

  if (member.role !== ProjectRole.ADMIN) {
    throw new apiError(
      403,
      "You don't have permission to manage sprints.",
    );
  }

  return member;
};

export const createSprint = async (
  organizationSlug: string,
  workspaceSlug: string,
  projectSlug: string,
  userId: string,
  data: CreateSprintInput,
) => {
  const project = await getProject(
    organizationSlug,
    workspaceSlug,
    projectSlug,
    userId,
  );

  await requireProjectAdmin(project.id, userId);

  if (
    data.startDate &&
    data.endDate &&
    new Date(data.endDate) <= new Date(data.startDate)
  ) {
    throw new apiError(
      400,
      "Sprint end date must be after the start date.",
    );
  }

  return await sprintRepository.createSprint(
    project.id,
    data,
  );
};

export const fetchAllSprints = async (
  organizationSlug: string,
  workspaceSlug: string,
  projectSlug: string,
  userId: string,
  status?: SprintStatus,
) => {
  const project = await getProject(
    organizationSlug,
    workspaceSlug,
    projectSlug,
    userId,
  );

  await requireProjectMember(project.id, userId);

  return await sprintRepository.fetchAllSprints(
    project.id,
    status,
  );
};

export const fetchSprint = async (
  organizationSlug: string,
  workspaceSlug: string,
  projectSlug: string,
  userId: string,
  sprintId: string,
) => {
  const project = await getProject(
    organizationSlug,
    workspaceSlug,
    projectSlug,
    userId,
  );

  await requireProjectMember(project.id, userId);

  const sprint = await sprintRepository.findSprintById(
    project.id,
    sprintId,
  );

  if (!sprint) {
    throw new apiError(404, "Sprint not found.");
  }

  return sprint;
};

export const startSprint = async (
  organizationSlug: string,
  workspaceSlug: string,
  projectSlug: string,
  userId: string,
  sprintId: string,
) => {
  const project = await getProject(
    organizationSlug,
    workspaceSlug,
    projectSlug,
    userId,
  );

  await requireProjectAdmin(project.id, userId);

  const sprint = await sprintRepository.findSprintById(
    project.id,
    sprintId,
  );

  if (!sprint) {
    throw new apiError(404, "Sprint not found.");
  }

  if (sprint.status !== SprintStatus.PLANNING) {
    throw new apiError(
      400,
      "Only a planned sprint can be started.",
    );
  }

  const activeSprint =
    await sprintRepository.findActiveSprint(
      project.id,
    );

  if (activeSprint) {
    throw new apiError(
      409,
      "Another sprint is already active.",
    );
  }

  if (
    sprint.startDate &&
    sprint.endDate &&
    sprint.endDate <= new Date()
  ) {
    throw new apiError(
      400,
      "Sprint end date must be in the future.",
    );
  }

  return await sprintRepository.startSprint(
    sprint.id,
    sprint.startDate ?? new Date(),
  );
};

export const completeSprint = async (
  organizationSlug: string,
  workspaceSlug: string,
  projectSlug: string,
  userId: string,
  sprintId: string,
  data: CompleteSprintInput,
) => {
  const project = await getProject(
    organizationSlug,
    workspaceSlug,
    projectSlug,
    userId,
  );

  await requireProjectAdmin(project.id, userId);

  const sprint = await sprintRepository.findSprintById(
    project.id,
    sprintId,
  );

  if (!sprint) {
    throw new apiError(404, "Sprint not found.");
  }

  if (sprint.status !== SprintStatus.ACTIVE) {
    throw new apiError(
      400,
      "Only an active sprint can be completed.",
    );
  }

  if (data.moveIncompleteTo === "NEXT_SPRINT") {
    const nextSprint =
      await sprintRepository.findSprintById(
        project.id,
        data.nextSprintId!,
      );

    if (!nextSprint) {
      throw new apiError(
        404,
        "Next sprint not found.",
      );
    }

    if (nextSprint.id === sprint.id) {
      throw new apiError(
        400,
        "An active sprint cannot move issues to itself.",
      );
    }

    if (nextSprint.status !== SprintStatus.PLANNING) {
      throw new apiError(
        400,
        "Issues can only be moved to a planned sprint.",
      );
    }
  }

  return await sprintRepository.completeSprint(
    project.id,
    sprint.id,
    data,
  );
};

export const fetchSprintIssues = async (
  organizationSlug: string,
  workspaceSlug: string,
  projectSlug: string,
  userId: string,
  sprintId: string,
) => {
  const project = await getProject(
    organizationSlug,
    workspaceSlug,
    projectSlug,
    userId,
  );

  await requireProjectMember(project.id, userId);

  const sprint = await sprintRepository.findSprintById(
    project.id,
    sprintId,
  );

  if (!sprint) {
    throw new apiError(404, "Sprint not found.");
  }

  return await sprintRepository.fetchSprintIssues(
    project.id,
    sprint.id,
  );
};
