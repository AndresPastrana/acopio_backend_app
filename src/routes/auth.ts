import { Router } from "express";
import { body, query } from "express-validator";
import { isValidObjectId, Types } from "mongoose";
import { Role } from "../types.d.js";
import { AuthController } from "./../controllers/index.js";
import { validateRequest } from "./../middleware/index.js";
import { ProductiveBaseModel, UserModel } from "./../models/index.js";
export const router = Router();

// Validate that the username and password comes
router.post(
	"/login",
	[
		body(["username", "password"], "Required fields missed")
			.exists({ values: "null" })
			.isString(),
		validateRequest,
	],
	AuthController.login,
);

// TODO:
router.post(
	"/register",
	[
		query("role")
			.exists({ values: "null" })
			.isString()
			.isIn([Role.Admin, Role.Specialist]),
		query("role", "Inavalid role, the system alredy have an adnim")
			.if((value) => Role.Admin === value)
			.custom(async (value) => {
				const query = UserModel.find({ role: value });
				const results = await query.exec();
				if (results[0]) {
					throw new Error("System alredy have an adimn");
				}
			}),
		body("productiveBaseInCharge", "Invalid productive base id")
			.custom((id) => isValidObjectId(id))
			.optional(),
		body("productiveBaseInCharge", "Invalid productive base")
			.if((_value, { req }) => req.query?.role === Role.Specialist || false)
			.custom(async (value) => {
				console.log("here");

				const query = UserModel.find({
					role: Role.Specialist,
					productiveBaseInCharge: new Types.ObjectId(value),
				});
				const results = await query.exec();

				if (results[0]) {
					throw new Error(
						"This Prodcutive base alredy has an specialist asigned, ",
					);
				}
			})
			.optional({ values: "null" }),

		body("productiveBaseInCharge")
			.if((_value, { req }) => req.role === Role.Specialist)
			.custom(async (value) => {
				const query = ProductiveBaseModel.findById(new Types.ObjectId(value));
				const result = await query.exec();
				if (!result) {
					throw new Error("Invalid productive base _id");
				}
			})
			.optional(),
		body(
			["username", "firstname", "surename", "username", "password"],
			"This field is required",
		).exists({ values: "null" }),
		body(["secondname", "second_surename"], "Should be a string")
			.isString()
			.optional(),
		body("username", "Invalid username").custom(async (value) => {
			const query = UserModel.find({ username: value });
			const result = await query.exec();
			if (result[0]) {
				throw new Error("Invalid username");
			}
		}),
		body(
			["username", "firstname", "surename", "username", "password"],
			"Should be a string",
		).isString(),
		body("password", "Weak password").isStrongPassword(),

		validateRequest,
	],
	AuthController.register,
);

// /auth/user?role=admin&id=etefv45fgdg
router.get(
	"/user",
	[
		query(["role", "id"]).exists({ values: "null" }),
		query("role").isIn([Role.Admin, Role.Specialist]),
		query("id").custom((value) => isValidObjectId(value)),
		validateRequest,
	],
	AuthController.getUser,
);
