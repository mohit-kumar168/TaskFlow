import prisma from "@/prisma/client";

export const fetchProjectIssues = async (
  projectId: string,
) => {
  return await prisma.issue.findMany({
    where: {
      projectId,
      isArchived: false,
    },
    select: {
      id: true,
      columnId: true,
      priority: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};

export const fetchSprintProgress = async (
  projectId: string,
) => {
  return await prisma.sprint.findMany({
    where: {
      projectId,
    },
    select: {
      id: true,
      name: true,
      issues: {
        where: {
          projectId,
          isArchived: false,
        },
        select: {
          id: true,
          columnId: true,
          status: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};
