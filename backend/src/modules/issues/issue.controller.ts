import type { Request, Response } from "express";
import asyncHandler from "@/utils/asyncHandler";
import prisma from "@/prisma/client";
import apiError from "@/utils/apiError";
import apiResponse from "@/utils/apiResponse";
import { send } from "node:process";

export const createIssue = asyncHandler(async (req: Request, res: Response) => {
	const projectId = req.params.projectId as string;

	const { title, description, priority, assigneeId, dueDate } = req.body;

	if (!title || !priority || !dueDate) {
		throw new apiError(400, "Title, priority and due date required");
	}

	const parseDueDate = new Date(dueDate);
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	if (isNaN(parseDueDate.getTime()) || parseDueDate < today) {
		throw new apiError(400, "Invalid due date")
	}

	const newPriority = priority.trim().toUpperCase();
	if (!["HIGH", "MEDIUM", "LOW", "URGENT"].includes(newPriority)) {
		throw new apiError(400, "Priority not recognized");
	}

	if (assigneeId) {
		const assignee = await prisma.projectMember.findUnique({
			where: {
				projectId_userId: {
					projectId,
					userId: assigneeId
				}
			}
		});

		if (!assignee) {
			throw new apiError(404, "Assignee is not a project member");
		}
	}

	const project = await prisma.projectMember.findFirst({
		where: {
			projectId,
			userId: req.user!.id,
			role: "ADMIN"
		},
		include: {
			project: {
				select: {
					key: true,
				},
			}
		}
	});

	if (!project) {
		throw new apiError(404, "Project not found");
	}

	const board = await prisma.board.findUnique({
		where: {
			projectId
		},
		include: {
			columns: true
		}
	});

	if (!board) {
		throw new apiError(404, "Board not found");
	}

	const todoColumn = board?.columns.find((column) => column.title === "Todo");
	if (!todoColumn) {
		throw new apiError(404, "Todo column not found");
	}

	const result = await prisma.$transaction(async (tx) => {
		const issueCount = await tx.issue.count({
			where: {
				projectId
			}
		});

		const code = `${project.project.key}-${issueCount + 1}`;

		const isIssueExist = await tx.issue.findUnique({
			where: {
				projectId_code: {
					projectId,
					code
				}
			}
		})

		if (isIssueExist) {
			throw new apiError(400, "Issue already exists");
		}

		const order = (await tx.issue.count({
			where: {
				columnId: todoColumn.id
			}
		})) + 1;

		const issue = await tx.issue.create({
			data: {
				projectId,
				columnId: todoColumn.id,
				code,
				title,
				description,
				priority: newPriority,
				reporterId: req.user!.id,
				dueDate: parseDueDate,
				assigneeId,
				order
			}
		});

		return { issue };
	});

	return res.status(201).json(
		new apiResponse(
			"Issue created successfully",
			{
				issue: result.issue
			}

		)
	);
});

export const fetchAllIssues = asyncHandler(async (req: Request, res: Response) => {
	const projectId = req.params.projectId as string;

	const projectMembership = await prisma.projectMember.findUnique({
		where: {
			projectId_userId: {
				projectId,
				userId: req.user!.id
			}
		}
	});

	if (!projectMembership) {
		throw new apiError(404, "Project not found or you don't have access")
	}

	const issues = await prisma.issue.findMany({
		where: {
			projectId,
			isArchived: false
		},
		include: {
			column: {
				select: {
					id: true,
					title: true,
					order: true

				}
			},
			assignee: {
				select: {
					id: true,
					name: true,
					email: true
				}
			},
			reporter: {
				select: {
					id: true,
					name: true,
					email: true
				}
			}
		},
		orderBy: [
			{
				column: {
					order: "asc"
				}
			},
			{
				order: "asc"
			}
		]
	});

	return res.status(200).json(
		new apiResponse(
			"Issues fetched successfully",
			issues
		)
	);
});

export const fetchIssue = asyncHandler(async (req: Request, res: Response) => {
	const projectId = req.params.projectId as string;
	const issueId = req.params.issueId as string;

	const projectMembership = await prisma.projectMember.findUnique({
		where: {
			projectId_userId: {
				projectId,
				userId: req.user!.id
			}
		},
	});

	if (!projectMembership) {
		throw new apiError(404, "Project not found or you don't have access");
	}

	const issue = await prisma.issue.findFirst({
		where: {
			id: issueId,
			projectId,
			isArchived: false
		},
		include: {
			column: {
				select: {
					id: true,
					title: true,
					order: true
				}
			},
			assignee: {
				select: {
					id: true,
					name: true,
					email: true
				}
			},
			reporter: {
				select: {
					id: true,
					name: true,
					email: true
				}
			}
		}
	});

	if (!issue) {
		throw new apiError(404, "Issue not found");
	}

	return res.status(200).json(
		new apiResponse(
			"Issue fetched successfully",
			issue
		)
	);
});

export const updateIssue = asyncHandler(async (req: Request, res: Response) => {
	const projectId = req.params.projectId as string;
	const issueId = req.params.issueId as string;

	const { title, description, status, priority, assigneeId } = req.body;

	if (!title || !status || !priority) {
		throw new apiError(400, "Fields are required");
	}

	const newStatus = status.trim().toUpperCase();
	if (!["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"].includes(newStatus)) {
		throw new apiError(400, "Invalid status");
	}

	const newPriority = priority.trim().toUpperCase();
	if (!["HIGH", "MEDIUM", "LOW", "URGENT"].includes(newPriority)) {
		throw new apiError(400, "Priority not recognized");
	}

	if (assigneeId) {
		const assignee = await prisma.projectMember.findUnique({
			where: {
				projectId_userId: {
					projectId,
					userId: assigneeId
				}
			}
		});

		if (!assignee) {
			throw new apiError(404, "Assignee is not a member of this project");
		}
	}



	const projectMembership = await prisma.projectMember.findFirst({
		where: {
			projectId,
			userId: req.user!.id,
		}
	});

	if (!projectMembership) {
		throw new apiError(404, "Project not found or you don't have access");
	}

	const issueExist = await prisma.issue.findFirst({
		where: {
			id: issueId,
			projectId,
			isArchived: false
		}
	});

	if (!issueExist) {
		throw new apiError(404, "Issue not found");
	}

	let updateData = {};

	if (projectMembership.role === "ADMIN") {
		updateData = {
			title,
			description,
			priority: newPriority,
			assigneeId,
			status: newStatus
		};
	}
	if (projectMembership.role === "MEMBER") {
		updateData = {
			status: newStatus
		}
	}

	const targetIssue = await prisma.issue.update({
		where: {
			id: issueId
		},
		data: updateData,
		include: {
			column: {
				select: {
					id: true,
					title: true,
					order: true
				}
			},
			assignee: {
				select: {
					id: true,
					name: true,
					email: true
				}
			},
			reporter: {
				select: {
					id: true,
					name: true,
					email: true
				}
			}
		}

	});

	return res.status(200).json(
		new apiResponse(
			"Issue updated successfully",
			{
				issue: targetIssue
			}
		)
	);
});

export const removeIssue = asyncHandler(async (req: Request, res: Response) => {
	const projectId = req.params.projectId as string;
	const issueId = req.params.issueId as string;

	const projectMembership = await prisma.projectMember.findFirst({
		where: {
			projectId,
			userId: req.user!.id,
			role: "ADMIN"
		}
	});

	if (!projectMembership) {
		throw new apiError(404, "Project not found or you don't have access");
	}

	const issue = await prisma.issue.findFirst({
		where: {
			id: issueId,
			projectId,
			isArchived: false
		}
	});

	if (!issue) {
		throw new apiError(404, "Issue not found");
	}

	const targetIssue = await prisma.issue.update({
		where: {
			id: issueId
		},
		data: {
			isArchived: true
		}
	});

	return res.status(200).json(
		new apiResponse(
			"Issue removed successfully",
			targetIssue
		)
	);
});
