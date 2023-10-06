import { Router } from "express";
import { body, query } from "express-validator";
import { isValidObjectId, Types } from "mongoose";
import { ProductiveBaseModel } from "../../build/models/Productivebase.js";
import { enumMonth } from "../const.js";
import { validateCi } from "../helpers/index.js";
import {
	isValidDoc,
	isValidToken,
	protectRouteByRole,
} from "../middleware/index.js";
import { Role } from "../types.d.js";
import { ProducerController } from "./../controllers/index.js";
import { validateRequest } from "./../middleware/index.js";
import { ProducerModel, UserModel } from "./../models/index.js";
import { MonthContract } from "./../types.d.js";
export const router = Router();

// Validaciones al insertart un nuevo prodcutor
// Name must be a string type and unique
// validate ci
// validate productive base id
// The moth contracts will be empty at the begini

router.post(
	"/",
	[
		isValidToken,
		protectRouteByRole([Role.Specialist]),
		body("ci").custom((ci) => {
			if (validateCi(ci)) {
				return true;
			}

			throw new Error("Invalid ci");
		}),
		body(["firstname", "surename"], "Invalid value")
			.exists({ values: "null" })
			.isString(),
		body(["secondname", "second_surename"], "Should be a string")
			.isString()
			.optional(),
		body("cant_animals", "Should be an inetger number").isInt().optional(),
		body("productive_base")
			.exists({ values: "null" })
			.custom(async (productive_base) => {
				await isValidDoc(productive_base, ProductiveBaseModel, false);
				return true;
			}),
		body("productive_base").custom(async (productive_base, { req }) => {
			const { uid = null } = req.user;
			const userInfo = await UserModel.findById(new Types.ObjectId(uid));

			if (userInfo?.productiveBaseInCharge.toString() === productive_base) {
				return true;
			}
			throw new Error(
				"The current loged in user cant access the info of this productive base",
			);
		}),
		validateRequest,
	],
	ProducerController.insertProducer,
);

router.get(
	"/",
	[
		isValidToken,
		protectRouteByRole([Role.Specialist]),
		query("productiveBase").custom(async (productivebaseID) => {
			await isValidDoc(productivebaseID, ProductiveBaseModel, false);
			return true;
		}),
		query("id")
			.if((value) => value !== "all")
			.custom(async (producerId) => {
				await isValidDoc(producerId, ProducerModel, false);
				return true;
			}),
		query("productiveBase").custom(async (productiveBaseID, { req }) => {
			const logedUser = await UserModel.findById(
				new Types.ObjectId(req.user.uid),
			);

			if (!logedUser) {
				throw new Error("Your user has no longer access to the system");
			}

			if (logedUser?.productiveBaseInCharge.toString() === productiveBaseID) {
				return true;
			}
			throw new Error(
				"You cant access the info of this productive base, conctact the specialist",
			);
		}),
		validateRequest,
	],
	ProducerController.getProducers,
);
// PUT /producer?productiveBase=651efdc3710165dfd75b6780&id=651efdc3710165dfd75b6780
// Valid Productive Base
// valid producer id
// Valid that the loged user is the especailist of  the productive base

// Validate month_contracts
router.put("/", [
	isValidToken,
	protectRouteByRole([Role.Specialist]),
	// body("ci").custom((ci) => {
	// 	if (validateCi(ci)) {
	// 		return true;
	// 	}

	// 	throw new Error("Invalid ci");
	// }),
	body(
		["firstname", "surename", "secondname", "second_surename"],
		"Invalid value",
	)
		.isString()
		.optional(),
	body("cant_animals", "Should be an inetger number").isInt().optional(),
	body("months_contracts", "Invalid value(s)")
		.custom((months_contracts: Array<MonthContract & { _id: string }>) => {
			// TODO: Most validations here , month can not be repited
			months_contracts.forEach((month_contract) => {
				const { cant = null, month = null, _id = null } = month_contract;

				if (!month || !_id) {
					throw new Error("Missed data in the month_contract");
				}

				if (typeof cant !== "number") {
					throw new Error(`cant must be a number , typeof ${typeof cant}`);
				}
				if (!isValidObjectId(_id)) {
					throw new Error(`Month contract _id is invalid ${typeof _id}`);
				}

				if (!enumMonth.includes(month)) {
					throw new Error(`Month contract month is invalid , month: ${month} `);
				}
			});
			return true;
		})
		.optional(),
	query("productiveBase").custom(async (productivebaseID) => {
		await isValidDoc(productivebaseID, ProductiveBaseModel, false);
		return true;
	}),
	query("id").custom(async (producerId) => {
		await isValidDoc(producerId, ProducerModel, false);
		return true;
	}),
	query("productiveBase").custom(async (productiveBaseID, { req }) => {
		const logedUser = await UserModel.findById(
			new Types.ObjectId(req.user.uid),
		);

		if (!logedUser) {
			throw new Error("Your user has no longer access to the system");
		}

		if (logedUser?.productiveBaseInCharge.toString() === productiveBaseID) {
			return true;
		}
		throw new Error(
			"The loged user can not access the info of this productive base, conctact the admin",
		);
	}),
	validateRequest,
	ProducerController.editProducer,
]);

router.delete(
	"/:id",
	[isValidToken, protectRouteByRole([Role.Specialist]), validateRequest],
	ProducerController.deleteProducer,
);
