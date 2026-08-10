import { z } from "zod";
import { ProjectRole } from "@/generated/prisma/enums";

export const createProjectSchema = z.object({
	body: z.object({
		name: z
			.string()
			.trim()
			.min(2, "Project name must be at least 2 characters.")
			.max(100, "Project name cannot exceed 100 characters."),

		key: z
			.string()
			.trim()
			.min(2, "Project key must be at least 2 characters.")
			.max(10, "Project key cannot exceed 10 characters.")
			.regex(
				/^[a-zA-Z0-9]+$/,
				"Project key can only contain letters and numbers.",
			),

		description: z
			.string()
			.trim()
			.max(500, "Description cannot exceed 500 characters.")
			.optional(),

		iconUrl: z
			.url("Invalid icon URL.")
			.optional(),

		boardName: z
			.string()
			.trim()
			.min(2, "Board name must be at least 2 characters.")
			.max(100, "Board name cannot exceed 100 characters."),
	}),
});

export const updateProjectSchema = z.object({
	body: z.object({
		name: z
			.string()
			.trim()
			.min(2, "Project name must be at least 2 characters.")
			.max(100, "Project name cannot exceed 100 characters.")
			.optional(),

		description: z
			.string()
			.trim()
			.max(500, "Description cannot exceed 500 characters.")
			.optional(),

		iconUrl: z
			.url("Invalid icon URL.")
			.optional(),
	}),
});

export const addProjectMemberSchema = z.object({
	body: z.object({
		email: z
			.string()
			.pipe(z.email("Invalid email address.")),

		role: z
			.enum(ProjectRole)
			.optional(),
	}),
});

export const updateProjectMemberSchema = z.object({
	body: z.object({
		role: z.enum(ProjectRole),
	}),
});
