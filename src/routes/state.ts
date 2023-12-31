import { Router } from "express";
import { param } from "express-validator";
import { isValidObjectId } from "mongoose";
import { StateController } from "../controllers/state.js";
export const router = Router();

// GET /state?id_province=3463cbgcw46346
router.get(
	"/:id_province",
	[
		param("id_province")
			.exists({ values: "null" })
			.custom((value) => isValidObjectId(value)),
	],
	StateController.getStatesByProvinceId,
);

// Get all states GETS /state
router.get("/", StateController.getStates);

// Private route POST /state
// router.post(
// 	"/",
// 	[isValidToken, protectRouteByRole([Role.Specialist])],
// 	StateController.insertState,
// );
// router.delete("/", StateController.deleteState);
// router.put("/:id", StateController.editState);
