import { Request, Response } from "express";
import { Types } from "mongoose";
import { createJWTAsync } from "../helpers/jwt.js";
import { UserModel } from "../models/index.js";
import { hashString } from "./../helpers/index.js";
import { handleResponse } from "./../middleware/index.js";
import { Role } from "./../types.d.js";
//  /auth?role=specialist
const register = async (req: Request, res: Response) => {
	try {
		const {
			username,
			password,
			firstname,
			surename,
			secondname = "",
			second_surename = "",
			productiveBaseInCharge = null,
		} = req.body;
		const { role } = req.query;
		const hashedPassword = await hashString(password);

		const newUser = new UserModel({
			username,
			password: hashedPassword,
			role,
			firstname,
			surename,
		});
		if (role === Role.Specialist) {
			//  TODO: fix this tipo error in types.ts
			newUser.productiveBaseInCharge = new Types.ObjectId(
				productiveBaseInCharge,
			);
		}

		if (secondname) {
			newUser.secondname = secondname;
		}
		if (second_surename) {
			newUser.second_surename = second_surename;
		}

		const result = await newUser.save();

		return handleResponse({
			statusCode: 201,
			data: result,
			res,
		});
	} catch (error) {
		console.log(error);

		res.status(400).json({ error });
	}
};

const login = async (req: Request, res: Response) => {
	try {
		const { username = "", password = "" } = req.body;
		const query = UserModel.find({ username });
		const result = await query.exec();

		// TODO: validate no results in query
		if (result.length === 0) {
			return res.json({ msg: "Invalid use name or password" });
		}

		const user = result[0];

		// TODO: Validate Wrong password
		// const isValidPassword = await user.validatePassword(password);

		// TODO: Generate token
		console.log(user);

		const token = await createJWTAsync({
			uid: user._id.toString(),
			role: user.role,
		});

		console.log(token);

		return handleResponse({
			data: {
				access_token: token,
			},
			statusCode: 200,
			res,
		});
	} catch (error) {
		return res.json({ error });
	}
};
// /auth?role=admin&id=sdfsdfsfsdfsdfsdf
const getUser = async (req: Request, res: Response) => {
	const { role, id } = req.query;

	const query = UserModel.find({ _id: id, role });

	// Si es especialista get the info the la base productiva
	if (role === Role.Specialist) {
		query.populate("productiveBaseInCharge");
	}

	const result = await query.exec();

	return handleResponse({
		res,
		data: result,
		statusCode: 200,
	});
};

export const AuthController = {
	register,
	getUser,
	login,
};
