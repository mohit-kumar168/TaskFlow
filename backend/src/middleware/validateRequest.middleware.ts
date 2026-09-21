import type { Request, Response, NextFunction } from "express";
import { ZodError, z } from "zod";
import apiError from "../utils/apiError";

const validateRequest = (schemas: z.ZodType) => (req: Request, res: Response, next: NextFunction) => {
	try {
		const parsed = schemas.parse({
			body: req.body,
			params: req.params,
			query: req.query,
		}) as {
			body?: unknown;
			params?: Request["params"];
			query?: Request["query"];
		};

		if (parsed.body !== undefined) req.body = parsed.body;
		if (parsed.params !== undefined) req.params = parsed.params;

		next();
	} catch (error) {
		if (error instanceof ZodError) {
			return next(
				new apiError(400, error.issues.map(issue => issue.message).join(", "))
			)
		};
		next(error);
	}
};

export default validateRequest;
