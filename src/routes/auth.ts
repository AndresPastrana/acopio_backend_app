import { Router } from "express";
import { body, query } from "express-validator";
import { isValidObjectId } from "mongoose";
import { Role } from "../types.d.js";
import { AuthController } from "./../controllers/index.js";
import { validateRequest } from "./../middleware/index.js";

export const router = Router();

// Validate that the username and password comes
router.post(
	"/login",
	[
		body(["username", "password"]).exists({ values: "null" }).isString(),
		validateRequest,
	],
	AuthController.login,
);

const a = "asd";

// TODO:
// en el caso de que el role sea ADMIN, revisar que no exista mas ninguno en la tabla USER -->404
// en el caso de que el role sea especialista :
// - revisar que ningun especialista de la tabla usuario  tiene asignada las base Productiva con ese id
// -Revisar que la base productiva existe
router.post(
	"/register",
	[
		body(
			[
				"username",
				"firstname",
				"surename",
				"username",
				"password",
				"productiveBaseInCharge",
			],
			"This field is required",
		).exists({ values: "null" }),
		body(["secondname", "second_surename"], "Should be a string")
			.isString()
			.optional(),
		body(
			["username", "firstname", "surename", "username", "password"],
			"Should be a string",
		).isString(),
		body("password", "Weak password").isStrongPassword(),
		body("productiveBaseInCharge", "Invalid productive base id")
			.custom((id) => isValidObjectId(id))
			.optional(),
		query("role")
			.exists({ values: "null" })
			.isString()
			.isIn([Role.Admin, Role.Specialist]),
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
