import { Router } from "express";
import { body, param } from "express-validator";
import { ProductiveBaseController } from "../controllers/index.js";
import { Role } from "../types.d.js";
import {
	isValidDoc,
	isValidToken,
	protectRouteByRole,
	validateRequest,
} from "./../middleware/index.js";
import {
	ProductiveBaseModel,
	RouteModel,
	StateModel,
} from "./../models/index.js";

export const router = Router();

// Private routes

// Validattions
// Nmae must be unquie and a string value
// Adreess should be a string value
// id_muncipio and id_route should be a ObjectID value and should exist
//
router.post(
	"/",
	[
		isValidToken,
		protectRouteByRole([Role.Admin]),
		body(["name", "address"], "Should be a string").isString(),
		body("name").custom(async (name) => {
			const doc = await ProductiveBaseModel.find({ name });

			if (doc[0]) {
				throw new Error("Name must be unique");
			}
			return true;
		}),
		body("route").custom(async (route) => {
			await isValidDoc(route, RouteModel, false);
			return true;
		}),
		body("state").custom(async (state) => {
			await isValidDoc(state, StateModel, false);
			return true;
		}),
		validateRequest,
	],
	ProductiveBaseController.insertAProductivebase,
);

router.get(
	"/",
	[isValidToken, protectRouteByRole([Role.Admin])],
	ProductiveBaseController.getAllProductiveBase,
);

// Get productive-base/368473chchx8746378x
router.get(
	"/:id",
	[
		isValidToken,
		protectRouteByRole([Role.Admin, Role.Specialist]),
		param("id").custom(async (productivebaseID) => {
			await isValidDoc(productivebaseID, ProductiveBaseModel, false);
			return true;
		}),
		validateRequest,
	],
	ProductiveBaseController.getProductiveBaseById,
);

router.put(
	"/:id",
	[
		isValidToken,
		protectRouteByRole([Role.Admin]),
		param("id").custom(async (productivebaseID) => {
			await isValidDoc(productivebaseID, ProductiveBaseModel, false);
			return true;
		}),
		body(["name", "address"], "Should be a string").isString().optional(),
		body("name")
			.custom(async (name, { req }) => {
				const doc = await ProductiveBaseModel.find({ name });

				if (doc[0] && doc[0]._id.toString() !== req.params?.id) {
					console.log(doc[0]._id.toString() !== req.query?.id);
					throw new Error("Name must be unique");
				}
				return true;
			})
			.optional(),
		body("route")
			.custom(async (route) => {
				await isValidDoc(route, RouteModel);
				return true;
			})
			.optional(),
		body("state")
			.custom(async (state) => {
				await isValidDoc(state, StateModel);
				return true;
			})
			.optional(),
		validateRequest,
	],
	ProductiveBaseController.editProductiveBaseById,
);

router.delete(
	"/:id",
	[
		isValidToken,
		protectRouteByRole([Role.Admin]),
		param("id").custom(async (productivebaseID) => {
			await isValidDoc(productivebaseID, ProductiveBaseModel, false);
			return true;
		}),
		validateRequest,
	],
	ProductiveBaseController.deleteProductiveBaseById,
);
