import { NextFunction, Request, RequestHandler, Response } from "express";
import { generate } from "random-words";
import validator from "validator";
import prisma from "../prisma.js";

export const shorten: RequestHandler = async (req: Request, res: Response) => {
	const generatedUrl: string = await generateUrl(7);

	if (!req.body || Object.keys(req.body).length === 0) {
		return res.status(400).json({
			message: "No URL",
		});
	}
	const urlToMask = req.body.url;

	if (validator.isURL(urlToMask)) {
		req.body.userId = req.user.id;
		await insertDataIntoDB(generatedUrl, req);
	} else {
		return res.status(400).json({
			message: "Invalid URL",
			data: {
				"bad-url": urlToMask,
			},
		});
	}

	return res.status(201).json({
		message: "Success",
		data: {
			newURL: generatedUrl,
		},
	});
};

async function insertDataIntoDB(generatedUrl: string, req: Request) {
	const urlId = (
		await prisma.shortenedUrl.create({
			data: req.body,
		})
	).id;

	await prisma.longUrl.create({
		data: {
			meaning: generatedUrl,
			shortenedUrlId: urlId,
		},
	});
}

async function generateUrl(length: number) {
	let output: string = "";
	for (let i: number = 0; i < length; i++) {
		let newWord: string = generate(1)[0];
		output += camelCase(newWord);
	}
	return output;
}

function camelCase(str: string) {
	return str
		.split(" ")
		.map((word, index) => {
			const lowered: string = word.toLowerCase();
			return index === 0
				? lowered.charAt(0).toUpperCase() + lowered.slice(1)
				: lowered.charAt(0).toUpperCase() + lowered.slice(1);
		})
		.join("");
}
