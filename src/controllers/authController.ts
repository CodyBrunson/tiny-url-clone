import { Request, RequestHandler, Response } from "express";
import prisma from "../prisma.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import env from "dotenv";

env.config();

const JWT_SECRET = process.env.JWT_SECRET!;

export const register: RequestHandler = async (req: Request, res: Response) => {
	const userEmailEntered = req.body?.email;

	const emailExists = await prisma.user.findFirst({
		where: { email: userEmailEntered },
	});

	if (emailExists) {
		return res.status(400).json({ data: "Email already exists" });
	}

	const saltRounds = 10;
	const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

	const user = await prisma.user.create({
		data: {
			...req.body,
			password: {
				create: {
					hash: hashedPassword,
				},
			},
		},
	});

	return res.status(201).json({ user });
};

export const login: RequestHandler = async (req: Request, res: Response) => {
	const { username } = req.body;

	const user = await prisma.user.findFirst({
		where: { username },
		include: { password: true },
	});

	if (!user) {
		return res.status(401).json({ message: "Invalid username" });
	}

	const passwordValid = await bcrypt.compare(
		req.body.password,
		user.password!.hash,
	);

	if (!passwordValid) {
		return res.status(401).json({ message: "Invalid password" });
	}

	const token = jwt.sign(
		{
			id: user.id,
			username: user.username,
		},
		JWT_SECRET,
		{
			expiresIn: "6h",
		},
	);

	return res.json(token);
};
