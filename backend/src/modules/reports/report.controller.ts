import type { Request, Response } from "express";

import asyncHandler from "@/utils/asyncHandler";
import apiResponse from "@/utils/apiResponse";

import * as reportService from "./report.service";

export const getIssueStatusReport =
  asyncHandler(
    async (
      req: Request,
      res: Response,
    ) => {
      const data =
        await reportService.fetchIssueStatusReport(
          req.params.organizationSlug as string,
          req.params.workspaceSlug as string,
          req.params.projectSlug as string,
          req.user!.id,
        );

      return res.status(200).json(
        new apiResponse(
          "Issue status report fetched successfully.",
          data,
        ),
      );
    },
  );

export const getIssuePriorityReport =
  asyncHandler(
    async (
      req: Request,
      res: Response,
    ) => {
      const data =
        await reportService.fetchIssuePriorityReport(
          req.params.organizationSlug as string,
          req.params.workspaceSlug as string,
          req.params.projectSlug as string,
          req.user!.id,
        );

      return res.status(200).json(
        new apiResponse(
          "Issue priority report fetched successfully.",
          data,
        ),
      );
    },
  );

export const getIssueTrendReport =
  asyncHandler(
    async (
      req: Request,
      res: Response,
    ) => {
      const data =
        await reportService.fetchIssueTrendReport(
          req.params.organizationSlug as string,
          req.params.workspaceSlug as string,
          req.params.projectSlug as string,
          req.user!.id,
        );

      return res.status(200).json(
        new apiResponse(
          "Issue trend report fetched successfully.",
          data,
        ),
      );
    },
  );

export const getSprintProgressReport =
  asyncHandler(
    async (
      req: Request,
      res: Response,
    ) => {
      const data =
        await reportService.fetchSprintProgressReport(
          req.params.organizationSlug as string,
          req.params.workspaceSlug as string,
          req.params.projectSlug as string,
          req.user!.id,
        );

      return res.status(200).json(
        new apiResponse(
          "Sprint progress report fetched successfully.",
          data,
        ),
      );
    },
  );
