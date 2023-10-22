import { Router } from "express";
import { body, check, param } from "express-validator";
import { Types, isValidObjectId } from "mongoose";
import { isValidToken, protectRouteByRole } from "../middleware/index.js";
import { RouteModel } from "../models/index.js";
import { Role } from "../types.d.js";
import { RouteController } from "./../controllers/index.js";
import { validateRequest } from "./../middleware/index.js";
export const router = Router();

// router.post("/:blob", [], RouteController.insertManyRoutes);
router.post(
	"/",
	[
		isValidToken,
		protectRouteByRole([Role.Admin]),
		body("name", "Invalid name")
			.exists({ values: "null" })
			.custom(async (value) => {
				// const regEx = trimedLowerRegExp(value);
				const query = RouteModel.find({ name: value });
				const result = await query.exec();
				if (result[0]) {
					throw new Error("Duplicate data");
				}
			}),
		validateRequest,
	],
	RouteController.insertRoute,
);

router.get(
	"/",
	[isValidToken, protectRouteByRole([Role.Admin])],
	RouteController.getAllRoutes,
);

router.get(
	"/:id",
	[
		isValidToken,
		protectRouteByRole([Role.Admin]),
		param("id", "Invalid route id")
			.exists({ values: "null" })
			.custom((value) => {
				console.log(value);

				if (!isValidObjectId(value)) {
					throw new Error("Invalid route");
				}
			}),

		validateRequest,
	],
	RouteController.getRouteById,
);

router.put(
	"/:id",
	[
		isValidToken,
		protectRouteByRole([Role.Admin]),
		check("id")
			.custom((id) => {
				if (!isValidObjectId(id)) {
					throw new Error("Invalid route id");
				}
				return true;
			})
			.custom(async (id) => {
				const query = RouteModel.findById(new Types.ObjectId(id));
				const doc = await query.exec();
				if (!doc) {
					throw new Error("Invalid route");
				}
				return true;
			}),
		 body('name').exists({values:'falsy'}).isString().withMessage("Invalid name"),	
		validateRequest,


	],
	RouteController.editRoute,
);

router.delete(
	"/:id",
	[
		isValidToken,
		protectRouteByRole([Role.Admin]),
		param("id", "Invalid route id")
			.exists({ values: "null" })
			.custom((value) => {
				if (!isValidObjectId(value)) {
					throw new Error("Invalid route");
				}
				return true;
			})
			.custom(async (value) => {
				// const regEx = trimedLowerRegExp(value);
				const query = RouteModel.findById(new Types.ObjectId(value));
				const result = await query.exec();
				if (result) {
					return true;
				}
				throw new Error("Invalid route id");
			}),
		validateRequest,
	],
	RouteController.deleteRoutes,
);
