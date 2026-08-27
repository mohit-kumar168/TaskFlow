import type { Request, Response } from "express";

import asyncHandler from "@/utils/asyncHandler";
import apiResponse from "@/utils/apiResponse";

import * as commentService from "./comment.service";

export const createComment = asyncHandler(
  async (req: Request, res: Response) => {
    const comment = await commentService.createComment(
      req.params.organizationSlug as string,
      req.params.workspaceSlug as string,
      req.params.projectSlug as string,
      req.params.issueId as string,
      req.user!.id,
      req.body,
    );

    return res
      .status(201)
      .json(
        new apiResponse(
          "Comment created successfully.",
          comment,
        ),
      );
  },
);

export const fetchAllComments = asyncHandler(
  async (req: Request, res: Response) => {
    const comments =
      await commentService.fetchAllComments(
        req.params.organizationSlug as string,
        req.params.workspaceSlug as string,
        req.params.projectSlug as string,
        req.params.issueId as string,
        req.user!.id,
      );

    return res
      .status(200)
      .json(
        new apiResponse(
          "Comments fetched successfully.",
          comments,
        ),
      );
  },
);

export const updateComment = asyncHandler(
  async (req: Request, res: Response) => {
    const comment =
      await commentService.updateComment(
        req.params.organizationSlug as string,
        req.params.workspaceSlug as string,
        req.params.projectSlug as string,
        req.params.issueId as string,
        req.params.commentId as string,
        req.user!.id,
        req.body,
      );

    return res
      .status(200)
      .json(
        new apiResponse(
          "Comment updated successfully.",
          comment,
        ),
      );
  },
);

export const deleteComment = asyncHandler(
  async (req: Request, res: Response) => {
    await commentService.deleteComment(
      req.params.organizationSlug as string,
      req.params.workspaceSlug as string,
      req.params.projectSlug as string,
      req.params.issueId as string,
      req.params.commentId as string,
      req.user!.id,
    );

    return res
      .status(200)
      .json(
        new apiResponse(
          "Comment deleted successfully.",
          null,
        ),
      );
  },
);
