import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { handleResponse } from "./index.js";

export const isValidToken = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { authorization = null } = req.headers;
	if (!authorization || !authorization.includes("Bearer")) {
		return handleResponse({
			res,
			statusCode: 401,
			error: true,
			msg: "Authorization header missed or inavlid",
		});
	}

	// Verify token
	const toVerify = authorization?.split("Bearer ")[0];
	const key = process.env.SECRET_KEY || "";
	const token = jwt.verify(toVerify, key);
	if (token) {
		req.user = token;
		return next();
	}

	return handleResponse({
		res,
		statusCode: 401,
		error: true,
		msg: "Invalid token",
	});
};
