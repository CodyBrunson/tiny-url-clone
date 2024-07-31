import { RequestHandler } from "express";
import z, { ZodType } from "zod";
import * as schemas from "./schemas.js";
import { ValidationError } from "../errors/validationerror.js";
import auth from "./auth";

export const validateBody =
	(schema: ZodType<any>): RequestHandler =>
	(req, res, next) => {
		const result = schema.safeParse(req.body);

		if (!result.success) {
			return next(new ValidationError(result.error.issues));
		}
		next();
	};

export const login = validateBody(schemas.Login);
export const createUser = validateBody(schemas.Account);
