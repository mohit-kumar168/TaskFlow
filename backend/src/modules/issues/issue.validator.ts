import { z } from "zod";

import {
	IssuePriority,
	IssueType,
} from "@/generated/prisma/enums";

export const createIssueSchema = z.object({
	body: z.object({
		title: z
			.string()
			.trim()
			.min(1, "Issue title is required.")
			.max(200, "Issue title cannot exceed 200 characters."),

		description: z
			.string()
			.trim()
			.optional(),

		type: z
			.enum(IssueType)
			.optional(),

		priority: z
			.enum(IssuePriority)
			.optional(),

		dueDate: z
			.iso.datetime()
			.optional(),

		email: z
			.string()
			.pipe(z.email("Invalid assignee email."))
			.optional(),

		columnId: z
			.string()
			.optional(),
	}),
});

export const updateIssueSchema = z.object({
	body: z.object({
		title: z
			.string()
			.trim()
			.min(1, "Issue title cannot be empty.")
			.max(200, "Issue title cannot exceed 200 characters.")
			.optional(),

		description: z
			.string()
			.trim()
			.optional(),

		type: z
			.enum(IssueType)
			.optional(),

		priority: z
			.enum(IssuePriority)
			.optional(),

		dueDate: z
			.iso.datetime()
			.optional(),

		email: z
			.string()
			.pipe(z.email("Invalid assignee email."))
			.optional(),
	}),
});

export const moveIssueSchema = z.object({
	body: z.object({
		columnId: z
			.string()
			.min(1, "Column ID is required."),
	}),
});
