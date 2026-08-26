import type { Request, Response } from "express";

import asyncHandler from "@/utils/asyncHandler";
import apiResponse from "@/utils/apiResponse";

import * as sprintService from "./sprint.service";

export const createSprint = asyncHandler(
  async (req: Request, res: Response) => {
    const sprint = await sprintService.createSprint(
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
          "Sprint created successfully.",
          sprint,
        ),
      );
  },
);

export const fetchAllSprints = asyncHandler(
  async (req: Request, res: Response) => {
    const sprints = await sprintService.fetchAllSprints(
      req.params.organizationSlug as string,
      req.params.workspaceSlug as string,
      req.params.projectSlug as string,
      req.user!.id,
      req.query.status as any,
    );

    return res
      .status(200)
      .json(
        new apiResponse(
          "Sprints fetched successfully.",
          sprints,
        ),
      );
  },
);

export const fetchSprint = asyncHandler(
  async (req: Request, res: Response) => {
    const sprint = await sprintService.fetchSprint(
      req.params.organizationSlug as string,
      req.params.workspaceSlug as string,
      req.params.projectSlug as string,
      req.user!.id,
      req.params.sprintId as string,
    );

    return res
      .status(200)
      .json(
        new apiResponse(
          "Sprint fetched successfully.",
          sprint,
        ),
      );
  },
);

export const startSprint = asyncHandler(
  async (req: Request, res: Response) => {
    const sprint = await sprintService.startSprint(
      req.params.organizationSlug as string,
      req.params.workspaceSlug as string,
      req.params.projectSlug as string,
      req.user!.id,
      req.params.sprintId as string,
    );

    return res
      .status(200)
      .json(
        new apiResponse(
          "Sprint started successfully.",
          sprint,
        ),
      );
  },
);

export const completeSprint = asyncHandler(
  async (req: Request, res: Response) => {
    const sprint = await sprintService.completeSprint(
      req.params.organizationSlug as string,
      req.params.workspaceSlug as string,
      req.params.projectSlug as string,
      req.user!.id,
      req.params.sprintId as string,
      req.body,
    );

    return res
      .status(200)
      .json(
        new apiResponse(
          "Sprint completed successfully.",
          sprint,
        ),
      );
  },
);

export const fetchSprintIssues = asyncHandler(
  async (req: Request, res: Response) => {
    const issues =
      await sprintService.fetchSprintIssues(
        req.params.organizationSlug as string,
        req.params.workspaceSlug as string,
        req.params.projectSlug as string,
        req.user!.id,
        req.params.sprintId as string,
      );

    return res
      .status(200)
      .json(
        new apiResponse(
          "Sprint issues fetched successfully.",
          issues,
        ),
      );
  },
);
