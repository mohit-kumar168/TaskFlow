import prisma from "../../prisma/client";

export const fetchIssueStatusReport = async (projectId: string) => {
  return await prisma.issue.groupBy({
    by: ["status"],
    where: {
      projectId,
      isArchived: false,
    },
    _count: {
      _all: true,
    },
  });
};

export const fetchIssuePriorityReport = async (projectId: string) => {
  return await prisma.issue.groupBy({
    by: ["priority"],
    where: {
      projectId,
      isArchived: false,
    },
    _count: {
      _all: true,
    },
  });
};

export const fetchIssueTrendReport = async (projectId: string) => {
  return await prisma.issue.findMany({
    where: {
      projectId,
      isArchived: false,
    },
    select: {
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};

export const fetchSprintProgressReport = async (
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
          isArchived: false,
        },
        select: {
          status: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};
