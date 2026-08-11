import type { Request, Response } from "express";

import apiResponse from "@/utils/apiResponse";
import asyncHandler from "@/utils/asyncHandler";

import * as issueService from "./issue.service";

export const createIssue = asyncHandler(
	async (req: Request, res: Response) => {
		const issue = await issueService.createIssue(
			req.params.organizationSlug as string,
			req.params.workspaceSlug as string,
			req.params.projectSlug as string,
			req.user!.id,
			req.body,
		);

		return res
			.status(201)
			.json(
				new apiResponse(
					"Issue created successfully.",
					issue,
				),
			);
	},
);

export const fetchAllIssues = asyncHandler(
	async (req: Request, res: Response) => {
		const issues = await issueService.fetchAllIssues(
			req.params.organizationSlug as string,
			req.params.workspaceSlug as string,
			req.params.projectSlug as string,
			req.user!.id,
		);

		return res
			.status(200)
			.json(
				new apiResponse(
					"Issues fetched successfully.",
					issues,
				),
			);
	},
);

export const fetchIssue = asyncHandler(
	async (req: Request, res: Response) => {
		const issue = await issueService.fetchIssue(
			req.params.organizationSlug as string,
			req.params.workspaceSlug as string,
			req.params.projectSlug as string,
			req.user!.id,
			req.params.issueId as string,
		);

		return res
			.status(200)
			.json(
				new apiResponse(
					"Issue fetched successfully.",
					issue,
				),
			);
	},
);

export const updateIssue = asyncHandler(
	async (req: Request, res: Response) => {
		const issue = await issueService.updateIssue(
			req.params.organizationSlug as string,
			req.params.workspaceSlug as string,
			req.params.projectSlug as string,
			req.user!.id,
			req.params.issueId as string,
			req.body,
		);

		return res
			.status(200)
			.json(
				new apiResponse(
					"Issue updated successfully.",
					issue,
				),
			);
	},
);

export const moveIssue = asyncHandler(
	async (req: Request, res: Response) => {
		const issue = await issueService.moveIssue(
			req.params.organizationSlug as string,
			req.params.workspaceSlug as string,
			req.params.projectSlug as string,
			req.user!.id,
			req.params.issueId as string,
			req.body,
		);

		return res
			.status(200)
			.json(
				new apiResponse(
					"Issue moved successfully.",
					issue,
				),
			);
	},
);

export const archiveIssue = asyncHandler(
	async (req: Request, res: Response) => {
		const issue = await issueService.archiveIssue(
			req.params.organizationSlug as string,
			req.params.workspaceSlug as string,
			req.params.projectSlug as string,
			req.user!.id,
			req.params.issueId as string,
		);

		return res
			.status(200)
			.json(
				new apiResponse(
					"Issue archived successfully.",
					issue,
				),
			);
	},
);
