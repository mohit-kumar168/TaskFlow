import { OrganizationRole } from "@/generated/prisma/enums";
import z from "zod";

export const createOrganizationSchema = z.object({
	body: z.object({
		name: z
			.string()
			.trim()
			.min(2, "Organization name must be at least 2 characters.")
			.max(20, "Organization name cannot exceed 20 characters."),

		description: z
			.string()
			.trim()
			.max(500, "Description cannot exceed 500 characters.")
			.optional(),

		logoUrl: z
			.string()
			.url("Logo URL must be a valid URL.")
			.optional(),
	}),
});

export const updateOrganizationSchema = z.object({
	body: z
		.object({
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
				.string()
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

export const createOrganizationInviteSchema = z.object({
	body: z.object({
		email: z
			.string()
			.trim()
			.toLowerCase()
			.pipe(z.email("Please provide a valid email address.")),

		role: z
			.enum(OrganizationRole)
			.default(OrganizationRole.MEMBER),
	}),
});

export const updateOrganizationMemberRoleSchema = z.object({
	body: z.object({
		role: z
			.enum(OrganizationRole),
	}),
});
