import type { NextFunction, Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import apiError from "../utils/apiError";
import { verifyAccessToken } from "../utils/jwt.ts";
import prisma from "../prisma/client";

export const protect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
	const token = req.cookies?.accessToken || req.headers.authorization?.replace("Bearer ", "");

	if (!token) {
		throw new apiError(401, "Unauthorized");
	}

	const payload = verifyAccessToken(token);

	const user = await prisma.user.findUnique({
		where: {
			id: payload.id
		},
		select: {
			id: true,
			name: true,
			email: true
		}
	});

	if (!user) {
		throw new apiError(401, "Unauthorized");
	}

	req.user = user;

	next();
})
