import z from "zod";

export const createWorkspaceSchema = z.object({
	body: z.object({
		name: z
			.string()
			.trim()
			.min(2, "Workspace name must be atleast 2 characters.")
			.max(20, "Workspace name cannot exceed 20 characters."),

		description: z
			.string()
			.trim()
			.max(500, "Description cannot exceed 500 characters.")
			.optional(),

		logoUrl: z
			.url("Logo URL must be valid URL.")
			.optional(),
	}),
});

export const updateWorkspaceSchema = z.object({
	body: z.object({
		name: z
			.string()
			.trim()
			.min(2, "Organization name must be at least 2 characters.")
			.max(100, "Organization name cannot exceed 100 characters.")
			.optional(),

		description: z
			.string()
			.trim()
			.max(500, "Description cannot exceed 500 characters.")
			.optional(),

		logoUrl: z
			.url("Logo URL must be a valid URL.")
			.optional(),
	})
		.refine(
			(data) =>
				data.name !== undefined ||
				data.description !== undefined ||
				data.logoUrl !== undefined,
			{
				message: "At least one field is required to update the organization.",
			},
		),
});

export const addWorkspaceMemberSchema = z.object({
	body: z.object({
		email: z
			.string()
			.pipe(z.email("Please provide a valid email address.")),

		role: z
			.enum(["MEMBER", "ADMIN"])
			.optional(),
	}),
});

export const updateWorkspaceMemberRoleSchema = z.object({
	body: z.object({
		role: z.enum(
			["MEMBER", "ADMIN"],
			{
				message: "Role must be either MEMBER or ADMIN.",
			},
		),
	}),
});
