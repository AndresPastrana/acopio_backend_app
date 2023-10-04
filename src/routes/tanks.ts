import { Request, Response, Router } from "express";
import { body, param } from "express-validator";
import { isValidObjectId, Types } from "mongoose";
import { Role } from "../types.d.js";
import { TanksController } from "./../controllers/index.js";
import {
	isValidToken,
	protectRouteByRole,
	validateRequest,
} from "./../middleware/index.js";
import { RouteModel, StateModel, TankModel } from "./../models/index.js";

export const router = Router();

// This endpoint was just created to insert mock data DO NOT USE IT IN PROD!!!!!
// router.post("/:blob", [], TanksController.insertManytanks);

// GET tank/   Returns a list of all the tanks available wth all the routes details
router.get(
	"/",
	[isValidToken, protectRouteByRole([Role.Admin]), validateRequest],
	TanksController.getAllTanksWithDetails,
);

// POST tank/ Creates a new tank
router.post(
	"/",
	[
		isValidToken,
		protectRouteByRole([Role.Admin]),
		body(["name", "address"], "Invali value").isString(),
		body("capacity", "Invalid value").isFloat(),
		body("name", "Name mustbe unique").custom(async (value) => {
			const regEx = new RegExp(value, "i");
			const query = TankModel.find({ name: regEx });

			const result = await query.exec();

			if (result[0]) {
				throw new Error("Name must be unique");
			}
			return true;
		}),
		body("state", "Inavlid mongo id")
			.isMongoId()
			.custom(async (value) => {
				const state = await StateModel.findById(new Types.ObjectId(value));
				if (state) {
					return true;
				}
				throw new Error("Invalid State");
			}),
		body("routes")
			.isArray()
			.custom(async (routes) => {
				const objectIds = [];
				// TODO: Refactor this wit a map()
				for (let i = 0; i < routes.length; i++) {
					const id = routes[i];
					const promise = new Promise((resolve, reject) => {
						const isValid = isValidObjectId(id);
						return isValid
							? resolve(new Types.ObjectId(id))
							: reject(new Error("Invalid ID"));
					});

					objectIds.push(promise);
				}
				// Validate all ids
				await Promise.all(objectIds);
				//  All are valids ObjectIds
				return true;
			})
			.optional(),
		body(
			"routes",
			"Invalid Routes, one of them is alredy defined in other thank",
		)
			.custom(async (routes) => {
				for (let i = 0; i < routes.length; i++) {
					let flag = false;
					const element = routes[i];
					// Verify that any of the routes is arledy present in of of the other routes
					const results = await TankModel.find({});
					results.findIndex(({ routes }) => {
						const mappedRoutes = routes.map((r) => r.toString());

						const exist = mappedRoutes.includes(element);
						if (exist) {
							flag = true;
							throw new Error("");
						}
						return exist;
					});

					// const customizedQuery = query.$where(function (element: string) {
					// 	return element;
					// });
				}
				return true;
			})
			.optional(),

		body("routes", "Invalid route(s) found")
			.custom(async (routes) => {
				const promises = routes.map(async (r: string) => {
					const query = RouteModel.findById(new Types.ObjectId(r));
					return await query.exec();
				});
				const result = await Promise.all(promises); //Throws an error if all the promises dose,resulve

				const noExistRoute = result.some((doc) => doc === null);
				if (noExistRoute) {
					throw new Error("Some of the routes does not exist ");
				}
				return true;
			})
			.optional(),
		validateRequest,
	],
	TanksController.insertATank,
);
// GET tank/43564th56yfgh675  Get a tank info by  an id
router.get(
	"/:id",
	[
		isValidToken,
		protectRouteByRole([Role.Admin]),
		param("id")
			.custom((id) => {
				if (!isValidObjectId(id)) {
					throw new Error("Invalid route");
				}
				return true;
			})
			.custom(async (id) => {
				const doc = await TankModel.findById(new Types.ObjectId(id));
				if (doc) {
					return true;
				}
				throw new Error("Invalid tank id");
			}),
		validateRequest,
	],
	TanksController.getTankByIdWithDetails,
);
// PUT tank/43564th56yfgh675
router.put(
	"/:id",
	[
		isValidToken,
		protectRouteByRole([Role.Admin]),
		param("id")
			.custom((id) => {
				if (!isValidObjectId(id)) {
					throw new Error("Invalid route");
				}
				return true;
			})
			.custom(async (id) => {
				const doc = await TankModel.findById(new Types.ObjectId(id));
				if (doc) {
					return true;
				}
				throw new Error("Invalid tank id");
			}),
		body(["name", "address"], "Invali value").isString().optional(),
		body("capacity", "Invalid value").isFloat().optional(),
		body("name", "Name mustbe unique")
			.custom(async (value) => {
				const regEx = new RegExp(value, "i");
				const query = TankModel.find({ name: regEx });

				const result = await query.exec();

				if (result[0]) {
					throw new Error("Name must be unique");
				}
				return true;
			})
			.optional(),
		body("state", "Inavlid mongo id")
			.isMongoId()
			.custom(async (value) => {
				const state = await StateModel.findById(new Types.ObjectId(value));
				if (state) {
					return true;
				}
				throw new Error("Invalid State");
			})
			.optional(),
		body("routes")
			.isArray()
			.custom(async (routes) => {
				const objectIds = [];
				// TODO: Refactor this wit a map()
				for (let i = 0; i < routes.length; i++) {
					const id = routes[i];
					const promise = new Promise((resolve, reject) => {
						const isValid = isValidObjectId(id);
						return isValid
							? resolve(new Types.ObjectId(id))
							: reject(new Error("Invalid ID"));
					});

					objectIds.push(promise);
				}
				// Validate all ids
				await Promise.all(objectIds);
				//  All are valids ObjectIds
				return true;
			})
			.optional(),
		body(
			"routes",
			"Invalid Routes, one of them is alredy defined in other thank",
		)
			.custom(async (routes, { req }) => {
				for (let i = 0; i < routes.length; i++) {
					let flag = false;
					const element = routes[i];
					// Verify that any of the routes is arledy present in of of the other routes
					const results = await TankModel.find({});
					results.findIndex(({ routes, _id }) => {
						if (req.params?.id === _id.toString()) {
							return false;
						}
						const mappedRoutes = routes.map((r) => r.toString());

						const exist = mappedRoutes.includes(element);
						if (exist) {
							flag = true;
							throw new Error("");
						}
						return exist;
					});

					// const customizedQuery = query.$where(function (element: string) {
					// 	return element;
					// });
				}
				return true;
			})
			.optional(),

		body("routes", "Invalid route(s) found")
			.custom(async (routes) => {
				const promises = routes.map(async (r: string) => {
					const query = RouteModel.findById(new Types.ObjectId(r));
					return await query.exec();
				});
				const result = await Promise.all(promises); //Throws an error if all the promises dose,resulve

				const noExistRoute = result.some((doc) => doc === null);
				if (noExistRoute) {
					throw new Error("Some of the routes does not exist ");
				}
				return true;
			})
			.optional(),
		validateRequest,
	],
	TanksController.udpateATank,
);

router.delete(
	"/:id",
	[
		isValidToken,
		protectRouteByRole([Role.Admin]),
		param("id").custom((value) => {
			if (!isValidObjectId(value)) {
				throw new Error("Invalid route");
			}
			return true;
		}),
		validateRequest,
	],
	async (req: Request, res: Response) => {
		res.status(204).send();
	},
);
