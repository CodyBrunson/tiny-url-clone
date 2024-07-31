import { Request, RequestHandler, Response } from "express";
import prisma from "../prisma.js";

export const longUrlLookup: RequestHandler = async (
	req: Request,
	res: Response,
) => {
	const shortUrl = req.originalUrl?.replace("/", "");
	console.log(shortUrl);
	//Look up the shortenedUrlId in the longUrls table
	const longUrlEntry = await prisma.longUrl.findFirst({
		where: { meaning: shortUrl },
	});

	if (!longUrlEntry || !longUrlEntry.shortenedUrlId) {
		return res.status(404).json({ error: "Url not found" });
	}

	// Look up the url of that id in the shortenedUrls table
	const shortenedUrlEntry = await prisma.shortenedUrl.findUnique({
		where: { id: longUrlEntry.shortenedUrlId },
	});

	if (!shortenedUrlEntry || !shortenedUrlEntry.url) {
		return res.status(404).json({ error: "Shortened url not found" });
	}

	res.redirect(shortenedUrlEntry.url);
};
