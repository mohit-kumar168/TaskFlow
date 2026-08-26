import prisma from "@/prisma/client";
import type {
  CompleteSprintInput,
  CreateSprintInput,
} from "./sprint.types";
import { SprintStatus } from "@/generated/prisma/enums";

export const createSprint = async (
  projectId: string,
  data: CreateSprintInput,
) => {
  return await prisma.sprint.create({
    data: {
      projectId,
      name: data.name,
      goal: data.goal,
      startDate: data.startDate
        ? new Date(data.startDate)
        : null,
      endDate: data.endDate
        ? new Date(data.endDate)
        : null,
    },
  });
};

export const fetchAllSprints = async (
  projectId: string,
  status?: SprintStatus,
) => {
  return await prisma.sprint.findMany({
    where: {
      projectId,
      ...(status ? { status } : {}),
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const findSprintById = async (
  projectId: string,
  sprintId: string,
) => {
  return await prisma.sprint.findFirst({
    where: {
      id: sprintId,
      projectId,
    },
  });
};

export const findActiveSprint = async (
  projectId: string,
) => {
  return await prisma.sprint.findFirst({
    where: {
      projectId,
      status: SprintStatus.ACTIVE,
    },
  });
};

export const startSprint = async (
  sprintId: string,
  startDate: Date,
) => {
  return await prisma.sprint.update({
    where: {
      id: sprintId,
    },
    data: {
      status: SprintStatus.ACTIVE,
      startDate,
    },
  });
};

export const completeSprint = async (
  projectId: string,
  sprintId: string,
  data: CompleteSprintInput,
) => {
  return await prisma.$transaction(async (tx) => {
    await tx.issue.updateMany({
      where: {
        projectId,
        sprintId,
        status: {
          not: "DONE",
        },
        isArchived: false,
      },
      data: {
        sprintId:
          data.moveIncompleteTo === "BACKLOG"
            ? null
            : data.nextSprintId,
      },
    });

    return await tx.sprint.update({
      where: {
        id: sprintId,
      },
      data: {
        status: SprintStatus.COMPLETED,
      },
    });
  });
};

export const fetchSprintIssues = async (
  projectId: string,
  sprintId: string,
) => {
  return await prisma.issue.findMany({
    where: {
      projectId,
      sprintId,
      isArchived: false,
    },
    orderBy: {
      position: "asc",
    },
  });
};
