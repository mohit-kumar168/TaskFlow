import apiError from "@/utils/apiError";

import {
  IssueStatus,
  MembershipStatus,
  ProjectRole,
} from "@/generated/prisma/enums";

import type {
  CreateIssueInput,
  MoveIssueInput,
  UpdateIssueInput,
} from "./issue.types";

import * as issueRepository from "./issue.repository";
import * as projectRepository from "@/modules/projects/project.repository";
import * as workspaceRepository from "@/modules/workspaces/workspace.repository";
import * as organizationRepository from "@/modules/organization/organization.repository";
import * as authRepository from "@/modules/auth/auth.repository";
import * as notificationService from "@/modules/notifications/notification.service";

export const createIssue = async (organizationSlug: string, workspaceSlug: string, projectSlug: string, userId: string, data: CreateIssueInput) => {
  const organization = await organizationRepository.findOrganizationBySlug(organizationSlug, userId);
  if (!organization) {
    throw new apiError(404, "Organization not found.");
  }

  const workspace = await workspaceRepository.findWorkspaceBySlug(organization.id, workspaceSlug, userId);
  if (!workspace) {
    throw new apiError(404, "Workspace not found.");
  }

  const project = await projectRepository.findProjectBySlug(workspace.id, userId, projectSlug);
  if (!project) {
    throw new apiError(404, "Project not found.");
  }

  const projectMember = await projectRepository.findProjectMemberByUserId(project.id, userId);
  if (!projectMember) {
    throw new apiError(404, "You don't have permission to create issue.");
  }

  const board = await projectRepository.findBoardByProjectId(project.id);
  if (!board) {
    throw new apiError(404, "Board not found.");
  }

  let column;

  if (data.columnId) {
    column = await projectRepository.findBoardColumnById(board.id, data.columnId);
    if (!column) {
      throw new apiError(404, "Board column not found.");
    }
  } else {
    const columns = await projectRepository.fetchBoardColumns(board.id);

    column = columns.find((col) => col.name === "Todo");

    if (!column) {
      throw new apiError(404, "Todo column not found.");
    }
  }

  let assigneeId;

  if (data.email) {
    const assignee = await authRepository.findUserByEmail(data.email);
    if (!assignee) {
      throw new apiError(404, "Assignee not found.");
    }

    const assigneeProjectMember = await projectRepository.findProjectMemberByUserId(project.id, assignee.id);
    if (!assigneeProjectMember) {
      throw new apiError(404, "Assignee is not a member of this project.");
    }

    assigneeId = assignee.id;
  }

  let sprintId: string | undefined;

  if (data.sprintId) {
    const sprint = await issueRepository.findSprintById(
      project.id,
      data.sprintId,
    );

    if (!sprint) {
      throw new apiError(404, "Sprint not found in this project.");
    }

    sprintId = sprint.id;
  }

  const issues =
    await issueRepository.fetchAllIssuesForKeyGeneration(
      project.id,
    );

  const activeColumnIssues = issues.filter(
    (issue) =>
      issue.columnId === column.id &&
      !issue.isArchived,
  );

  const position = activeColumnIssues.length;

  const issueNumbers = issues
    .map((issue) => {
      const [, number] = issue.issueKey.split("-");
      return Number(number);
    })
    .filter((number) => Number.isInteger(number));

  const nextIssueNumber =
    issueNumbers.length > 0
      ? Math.max(...issueNumbers) + 1
      : 1;

  const issueKey = `${project.key}-${nextIssueNumber}`;

  console.log("Project ID:", project.id);
  console.log("Project Key:", project.key);
  console.log(
    "Existing issues:",
    issues.map((issue) => issue.issueKey),
  );
  console.log("Issue numbers:", issueNumbers);
  console.log("Next issue number:", nextIssueNumber);
  console.log("Generated issue key:", issueKey);

  const existingIssue = await issueRepository.findIssueByKey(project.id, issueKey);

  if (existingIssue) {
    console.log("COLLISION:", existingIssue);
    throw new apiError(409, "Unable to generate a unique issue key.");
  }

  const issue = await issueRepository.createIssue(project.id, column.id, userId, issueKey, position, data, assigneeId, sprintId);

  if (assigneeId && assigneeId !== userId) {
    await notificationService.createNotification({
      userId: assigneeId,
      title: "Issue assigned to you",
      message: `You have been assigned issue ${issue.issueKey}: ${issue.title}`,
    });
  }

  return issue;
};

export const fetchAllIssues = async (
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

  const projectMember =
    await projectRepository.findProjectMemberByUserId(
      project.id,
      userId,
    );

  if (!projectMember) {
    throw new apiError(
      403,
      "You don't have access to this project.",
    );
  }

  return await issueRepository.fetchAllIssues(
    project.id,
  );
};

export const fetchIssue = async (
  organizationSlug: string,
  workspaceSlug: string,
  projectSlug: string,
  userId: string,
  issueId: string,
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

  const projectMember =
    await projectRepository.findProjectMemberByUserId(
      project.id,
      userId,
    );

  if (!projectMember) {
    throw new apiError(
      403,
      "You don't have access to this project.",
    );
  }

  const issue =
    await issueRepository.fetchIssueById(
      project.id,
      issueId,
    );

  if (!issue) {
    throw new apiError(
      404,
      "Issue not found.",
    );
  }

  return issue;
};

export const updateIssue = async (
  organizationSlug: string,
  workspaceSlug: string,
  projectSlug: string,
  userId: string,
  issueId: string,
  data: UpdateIssueInput,
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

  const projectMember =
    await projectRepository.findProjectMemberByUserId(
      project.id,
      userId,
    );

  if (!projectMember) {
    throw new apiError(
      403,
      "You don't have permission to update this issue.",
    );
  }

  const issue =
    await issueRepository.fetchIssueById(
      project.id,
      issueId,
    );

  if (!issue) {
    throw new apiError(
      404,
      "Issue not found.",
    );
  }

  let sprintId: string | null | undefined;
  if (data.sprintId) {
    const sprint = await issueRepository.findSprintById(project.id, data.sprintId);

    if (!sprint) {
      throw new apiError(404, "Sprint not found in this project");
    }

    sprintId = sprint.id;
  } else if (data.sprintId === null) {
    sprintId = null;
  }

  let assigneeId: string | null | undefined;

  if (data.email) {
    const assignee =
      await authRepository.findUserByEmail(
        data.email,
      );

    if (!assignee) {
      throw new apiError(
        404,
        "Assignee not found.",
      );
    }

    const workspaceMember =
      await workspaceRepository.fetchWorkspaceMemberByUserId(
        workspace.id,
        assignee.id,
      );

    if (
      !workspaceMember ||
      workspaceMember.status !==
      MembershipStatus.ACTIVE
    ) {
      throw new apiError(
        400,
        "Assignee is not a member of this workspace.",
      );
    }

    const projectAssignee =
      await projectRepository.findProjectMemberByUserId(
        project.id,
        assignee.id,
      );

    if (!projectAssignee) {
      throw new apiError(
        400,
        "Assignee is not a member of this project.",
      );
    }

    assigneeId = assignee.id;
  }

  const updatedIssue = await issueRepository.updateIssue(
    issue.id,
    data,
    assigneeId,
    sprintId,
  );

  if (
    assigneeId &&
    assigneeId !== userId
  ) {
    await notificationService.createNotification({
      userId: assigneeId,
      title: "Issue assigned to you",
      message: `You have been assigned issue ${updatedIssue.issueKey}: ${updatedIssue.title}`,
    });
  }
  return updatedIssue;
};

export const moveIssue = async (
  organizationSlug: string,
  workspaceSlug: string,
  projectSlug: string,
  userId: string,
  issueId: string,
  data: MoveIssueInput,
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

  const projectMember =
    await projectRepository.findProjectMemberByUserId(
      project.id,
      userId,
    );

  if (!projectMember) {
    throw new apiError(
      403,
      "You don't have permission to move issues.",
    );
  }

  const issue =
    await issueRepository.fetchIssueById(
      project.id,
      issueId,
    );

  if (!issue) {
    throw new apiError(
      404,
      "Issue not found.",
    );
  }

  const board =
    await projectRepository.findBoardByProjectId(
      project.id,
    );

  if (!board) {
    throw new apiError(404, "Board not found.");
  }

  const column =
    await projectRepository.findBoardColumnById(
      board.id,
      data.columnId,
    );

  if (!column) {
    throw new apiError(
      404,
      "Board column not found.",
    );
  }
  let status: IssueStatus;

  switch (column.name.toLowerCase()) {
    case "todo":
      status = IssueStatus.TODO;
      break;

    case "in progress":
      status = IssueStatus.IN_PROGRESS;
      break;

    case "in review":
      status = IssueStatus.IN_REVIEW;
      break;

    case "done":
      status = IssueStatus.DONE;
      break;

    default:
      status = IssueStatus.TODO;
  }

  return await issueRepository.moveIssue(
    issue.id,
    status,
    data,
  );
};

export const archiveIssue = async (
  organizationSlug: string,
  workspaceSlug: string,
  projectSlug: string,
  userId: string,
  issueId: string,
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

  const projectMember =
    await projectRepository.findProjectMemberByUserId(
      project.id,
      userId,
    );

  if (!projectMember) {
    throw new apiError(
      403,
      "You don't have access to this project.",
    );
  }

  if (projectMember.role !== ProjectRole.ADMIN) {
    throw new apiError(
      403,
      "Only project owner or admin can archive issues.",
    );
  }

  const issue =
    await issueRepository.fetchIssueById(
      project.id,
      issueId,
    );

  if (!issue) {
    throw new apiError(
      404,
      "Issue not found.",
    );
  }

  return await issueRepository.archiveIssue(
    issue.id,
  );
};
