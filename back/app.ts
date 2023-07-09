import express, { NextFunction, Request, Response } from "express";
import session from "express-session";
import { PrismaClient } from "./prisma/prisma-client";
import bodyParser from "body-parser";
import { isSigninPayload, isRegistrationPayload } from "./utils";
import { RegistrationPayload, SigninPayload, UserWithoutLP } from "./types";

const prisma = new PrismaClient();

declare module "express-session" {
	interface SessionData {
		user?: UserWithoutLP;
	}
}

export const app = express();

app.set("trust proxy", 1); // trust first proxy
app.use(
	session({
		secret: "keyboard cat",
		resave: false,
		saveUninitialized: true,
		cookie: { secure: true },
	})
);

app.get("/session", (req, res) => {
	if (req.session.user) {
		return res.json({ user: req.session.user });
	}

	return res.status(401).end();
});

app.post("/signin", bodyParser.json(), async (req, res, next) => {
	try {
		const data = req.body as SigninPayload;

		if (!isSigninPayload(data)) {
			throw Error("Not signin payload.");
		}

		const { login, password } = data;

		const user = await prisma.user.findFirst({ where: { login } });
		if (!user) {
			throw Error("User not found.");
		}

		if (user.password !== password) {
			throw Error("Password incorrect");
		}

		const { login: _login, password: _password, ...userWithoutLP } = user;
		req.session.user = userWithoutLP;

		return res.status(200).end();
	} catch (error: any) {
		next(error);
	}
});

app.post("/signout", async (req, res, next) => {
	try {
		if (req.session.user) {
			delete req.session.user;
		}

		return res.status(200).end();
	} catch (error: any) {
		next(error);
	}
});

app.post("/reg", bodyParser.json(), async (req, res, next) => {
	try {
		const data = req.body as RegistrationPayload;

		if (!isRegistrationPayload(data)) {
			throw Error("Not registration payload.");
		}

		const { login, password } = data;

		let user = await prisma.user.findFirst({ where: { login } });
		if (user) {
			throw Error("User already exists.");
		}

		user = await prisma.user.create({ data: { login, password } });

		return res.status(200).end();
	} catch (error: any) {
		next(error);
	}
});

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
	const message =
		typeof error === "string"
			? error
			: "message" in error
			? error.message
			: "Неизвестная ошибка";

	res.send(message).status(500).end();
});
