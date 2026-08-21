import prisma from "@/prisma/client";
import type { CreateIssueInput, MoveIssueInput, UpdateIssueInput } from "./issue.types";
import type { IssueStatus } from "@/generated/prisma/enums";

export const createIssue = async (projectId: string, columnId: string, reporterId: string, issueKey: string, position: number, data: CreateIssueInput, assigneeId?: string) => {
	return await prisma.issue.create({
		data: {
			projectId,
			columnId,
			reporterId,
			assigneeId: assigneeId ?? null,
			issueKey,
			title: data.title,
			description: data.description,
			type: data.type,
			priority: data.priority,
			dueDate: data.dueDate,
			position,
		},
	});
};

export const fetchAllIssues = async (projectId: string) => {
	return await prisma.issue.findMany({
		where: {
			projectId,
			isArchived: false,
		},
	});
};

export const fetchIssueById = async (projectId: string, issueId: string) => {
	return await prisma.issue.findFirst({
		where: {
			id: issueId,
			projectId,
			isArchived: false,
		},
	});
};

export const findIssueByKey = async (projectId: string, issueKey: string) => {
	return await prisma.issue.findUnique({
		where: {
			projectId_issueKey: {
				projectId,
				issueKey,
			},
		},
	});
};

export const updateIssue = async (issueId: string, data: UpdateIssueInput, assigneeId?: string) => {
	return await prisma.issue.update({
		where: {
			id: issueId,
		},
		data: {
			title: data.title,
			description: data.description,
			priority: data.priority,
			dueDate: data.dueDate,
			type: data.type,
			assigneeId: assigneeId ?? null,
		},
	});
};

export const archiveIssue = async (issueId: string) => {
	return await prisma.issue.update({
		where: {
			id: issueId,
		},
		data: {
			isArchived: true,
		},
	});
};

export const moveIssue = async (issueId: string, status: IssueStatus, data: MoveIssueInput) => {
	return await prisma.issue.update({
		where: {
			id: issueId,
		},
		data: {
			columnId: data.columnId,
			status,
		},
	});
};

export const fetchAllIssuesForKeyGeneration = async (
	projectId: string,
) => {
	return await prisma.issue.findMany({
		where: {
			projectId,
		},
		select: {
			issueKey: true,
			columnId: true,
			isArchived: true,
		},
	});
};
