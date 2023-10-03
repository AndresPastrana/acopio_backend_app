import { Router } from "express";
import { StateController } from "../controllers/state.js";
import { isValidToken, protectRouteByRole } from "../middleware/index.js";
import { Role } from "../types.d.js";
export const router = Router();

// GET /state?id_province=3463cbgcw46346
router.get("/:id_province", StateController.getStatesByProvinceId);

// Get all states GETS /state
router.get("/", StateController.getStates);

// Private route POST /state
router.post(
	"/",
	[isValidToken, protectRouteByRole(Role.Specialist)],
	StateController.insertState,
);
// router.delete("/", StateController.deleteState);
// router.put("/:id", StateController.editState);
