import { Router } from "express";
import { body, query } from "express-validator";
import {
	isValidDoc,
	isValidToken,
	protectRouteByRole,
	validateRequest,
} from "../middleware/index.js";
import { MilkType, Role } from "../types.d.js";
import { ReportController } from "./../controllers/index.js";
import { ProducerModel } from "./../models/index.js";
export const router = Router();
// POST /report
router.post(
	"/",
	[
		isValidToken,
		protectRouteByRole([Role.Specialist]),
		body("dayli_collect", "Invalid dayli collect").isInt(),
		body("type_milk", "Invalid type of milk").isIn([
			MilkType.cold,
			MilkType.hot,
		]),
		body("dayli_collect", "Invalid dayli collect").isInt(),
		body("producer", "Invalid producer")
			.exists({ values: "null" })
			.custom(async (producer) => {
				await isValidDoc(producer, ProducerModel, false);
				return true;
			}),
		validateRequest,
	],
	ReportController.createReport,
);

// GET /report?producer=3743vn3hcc3n3c53

router.get(
	"/",
	[
		isValidToken,
		protectRouteByRole([Role.Specialist]),
		query("producer", "Invalid producer")
			.exists({ values: "null" })
			.custom(async (producer) => {
				await isValidDoc(producer, ProducerModel, false);
				return true;
			}),
	],
	ReportController.getAllReportsByProducer,
);
