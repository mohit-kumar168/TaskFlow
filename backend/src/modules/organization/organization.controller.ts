import type { Request, Response } from "express";
import asyncHandler from "@/utils/asyncHandler";
import * as organizationService from "./organization.service";
import apiResponse from "@/utils/apiResponse";

export const createOrganization = asyncHandler(async (req: Request, res: Response) => {
	const organization = await organizationService.createOrganization(req.user!.id, req.body);

	return res.status(201).json(
		new apiResponse(
			"Organization created successfully.",
			organization,
		),
	);
});

export const updateOrganization = asyncHandler(async (req: Request, res: Response) => {
	const organization = await organizationService.updateOrganization(req.params.slug as string, req.user!.id, req.body);

	return res.status(200).json(
		new apiResponse(
			"Organization updated successfully.",
			organization,
		),
	);
});

export const archiveOrganization = asyncHandler(async (req: Request, res: Response) => {
	const organization = await organizationService.archiveOrganization(req.params.slug as string, req.user!.id);

	return res.status(200).json(
		new apiResponse(
			"Organization archived successfully.",
			organization,
		),
	);
});

export const fetchAllOrganizations = asyncHandler(async (req: Request, res: Response) => {
	const organizations = await organizationService.fetchAllOrganizations(req.user!.id);

	return res.status(200).json(
		new apiResponse(
			"Organizations fetched successfully.",
			organizations,
		),
	);
});

export const fetchOrganization = asyncHandler(async (req: Request, res: Response) => {
	const organization = await organizationService.fetchOrganization(req.params.slug as string, req.user!.id);

	return res.status(200).json(
		new apiResponse(
			"Organization fetched successfully.",
			organization
		),
	);
});

export const inviteMember = asyncHandler(async (req: Request, res: Response) => {
	const invite = await organizationService.inviteMember(req.params.slug as string, req.user!.id, req.body);
	return res.status(201).json(
		new apiResponse(
			"Invitation sent successfully.",
			invite,
		),
	);
});

export const acceptInvite = asyncHandler(async (req: Request, res: Response) => {
	const member = await organizationService.acceptInvite(req.params.token as string, req.user!.id, req.user!.email);

	return res.status(200).json(
		new apiResponse(
			"Invitation accepted successfully.",
			member,
		),
	);
});

export const fetchAllOrganizationMembers = asyncHandler(
	async (req: Request, res: Response) => {
		const members =
			await organizationService.fetchAllOrganizationMembers(
				req.params.slug as string,
				req.user!.id,
			);

		return res.status(200).json(
			new apiResponse(
				"Organization members fetched successfully.",
				members,
			),
		);
	},
);

export const fetchOrganizationMember = asyncHandler(
	async (req: Request, res: Response) => {
		const member =
			await organizationService.fetchOrganizationMember(
				req.params.slug as string,
				req.user!.id,
				req.params.memberId as string,
			);

		return res.status(200).json(
			new apiResponse(
				"Organization member fetched successfully.",
				member,
			),
		);
	},
);

export const updateOrganizationMemberRole = asyncHandler(
	async (req: Request, res: Response) => {
		const member =
			await organizationService.updateOrganizationMemberRole(
				req.params.slug as string,
				req.user!.id,
				req.params.memberId as string,
				req.body.role,
			);

		return res.status(200).json(
			new apiResponse(
				"Organization member role updated successfully.",
				member,
			),
		);
	},
);

export const removeOrganizationMember = asyncHandler(
	async (req: Request, res: Response) => {
		const member =
			await organizationService.removeOrganizationMember(
				req.params.slug as string,
				req.user!.id,
				req.params.memberId as string,
			);

		return res.status(200).json(
			new apiResponse(
				"Organization member removed successfully.",
				member,
			),
		);
	},
);
