import type { Request, Response } from "express";

import apiResponse from "@/utils/apiResponse";
import asyncHandler from "@/utils/asyncHandler";

import * as attachmentService from "./attachment.service";

export const createAttachment = asyncHandler(
  async (req: Request, res: Response) => {
    const attachment =
      await attachmentService.createAttachment(
        req.params.organizationSlug as string,
        req.params.workspaceSlug as string,
        req.params.projectSlug as string,
        req.user!.id,
        req.params.issueId as string,
        req.file!,
      );

    return res
      .status(201)
      .json(
        new apiResponse(
          "Attachment uploaded successfully.",
          attachment,
        ),
      );
  },
);

export const fetchAttachments = asyncHandler(
  async (req: Request, res: Response) => {
    const attachments =
      await attachmentService.fetchAttachments(
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
          "Attachments fetched successfully.",
          attachments,
        ),
      );
  },
);
