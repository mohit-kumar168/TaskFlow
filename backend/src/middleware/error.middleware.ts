import type { NextFunction, Request, Response } from "express";
import apiError from "../utils/apiError";
import logger from "../config/logger";

export default function errorMiddleware(
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) {
	logger.warn(err.message);

	if (err instanceof apiError) {
		return res.status(err.statusCode).json({
			success: false,
			message: err.message,
		});
	}

	return res.status(500).json({
		success: false,
		message: "Internal Server Error",
	});
}
