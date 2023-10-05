import { Router } from "express";
import { body, query } from "express-validator";
import { isValidObjectId, Types } from "mongoose";
import { Role } from "../types.d.js";
import { AuthController } from "./../controllers/index.js";
import {
	isValidToken,
	protectRouteByRole,
	validateRequest,
} from "./../middleware/index.js";
import { ProductiveBaseModel, UserModel } from "./../models/index.js";
export const router = Router();

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

router.post(
	"/register",
	[
		isValidToken,
		protectRouteByRole([Role.Admin]),
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

//GET   /auth/user?role=specialistid&id=etefv45fgdg
// GET /user?role=specialistid=all
router.get(
	"/user",
	[
		isValidToken,
		protectRouteByRole([Role.Admin]),
		query(["role", "id"]).exists({ values: "null" }),
		query("role", "Invalid role").isIn([Role.Specialist]),
		query("id")
			.if((value) => value !== "all")
			.isMongoId()
			.custom(async (id, { req }) => {
				const users = await UserModel.find({
					_id: new Types.ObjectId(id),
					role: req.query?.role,
				});
				if (users[0]) {
					return true;
				}

				throw new Error("Invalid user id");
			}),
		validateRequest,
	],
	AuthController.getUser,
);

// PUT /user?role=specialistid=765asd76f5sd76f
router.put(
	"/user",
	[
		isValidToken,
		protectRouteByRole([Role.Admin]),
		query("role", "Invalid role").isIn([Role.Specialist]),
		query("id", "Invalid user id")
			.isMongoId()
			.custom(async (id) => {
				const doc = await UserModel.findById(new Types.ObjectId(id));
				if (doc) {
					return true;
				}
				throw new Error("Invalid user id");
			}),
		body(
			["username", "firstname", "secondname", "surename", "secondsurename"],
			"This field should be a string",
		)
			.isString()
			.optional(),
		body("password").isString().isStrongPassword().optional(),
		body("username", "This username is already taken")
			.custom(async (username) => {
				const doc = await UserModel.find({
					username: new RegExp(username, "i"),
				});

				if (doc[0]) {
					throw new Error("Invalid username");
				}

				return true;
			})
			.optional(),
		body("productiveBaseInCharge", "Invalid base id")
			.isMongoId()
			.custom(async (productiveBaseInCharge, { req }) => {
				const id = new Types.ObjectId(productiveBaseInCharge);

				const existQuery = ProductiveBaseModel.findById(id);

				const haveASpecialistQuery = UserModel.find({
					productiveBaseInCharge: id,
				});

				const [r1, r2] = await Promise.all([
					existQuery.exec(),
					haveASpecialistQuery.exec(),
				]);
				const index = r2.findIndex(
					(user) => user._id.toString() !== req.query?.id,
				);

				if (!r1 || index >= 0) {
					throw new Error("Invalid productiveBaseInCharge");
				}
				return true;
			})
			.optional(),
		validateRequest,
	],
	AuthController.edituser,
);

// PUT /user?role=specialistid=765asd76f5sd76f
router.delete(
	"/user",
	[
		isValidToken,
		protectRouteByRole([Role.Admin]),
		query("role", "Invalid role").isIn([Role.Specialist]),
		query("id", "Invalid user id")
			.isMongoId()
			.custom(async (id) => {
				const doc = await UserModel.findById(new Types.ObjectId(id));
				if (doc) {
					return true;
				}
				throw new Error("Invalid user id");
			}),
		validateRequest,
	],
	AuthController.deletetUser,
);
