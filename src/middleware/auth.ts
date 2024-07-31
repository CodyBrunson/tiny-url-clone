import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import env from "dotenv";

env.config();

const JWT_SECRET = process.env.JWT_SECRET!;

const extractTokenFromHeader = (authHeader: string) => {
	return authHeader.split(" ")[1];
};

const auth: RequestHandler = (req, res, next) => {
	try {
		if (!req.headers.authorization) {
			return res
				.status(401)
				.json({ message: "Missing Authorization Header" });
		}
		const authHeader = req.headers.authorization!;
		const token = extractTokenFromHeader(authHeader);

		const decodedUser = jwt.verify(token, JWT_SECRET);
		req.user = decodedUser;

		next();
	} catch (err) {
		res.status(401).send("Unauthorized");
	}
};

export default auth;
