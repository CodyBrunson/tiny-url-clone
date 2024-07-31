import { NextFunction, Request, RequestHandler, Response } from "express";
import prisma from "../prisma.js";

export const getUserInformationById: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const userId = Number.parseInt(req.params.id);
	const userQuery = await prisma.user.findUnique({
		where: {
			id: userId,
		},
		include: {
			shortenedUrls: true,
		},
	});

	if (!userQuery) {
		return next(new Error("404"));
	}

	return res.send({ user: userQuery });
};
