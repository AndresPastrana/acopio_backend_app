import { Request, Response, Router } from "express";
import { Role } from "../types.d.js";
import { TanksController } from "./../controllers/index.js";
import { isValidToken, protectRouteByRole } from "./../middleware/index.js";
export const router = Router();

// This endpoint was just created to insert mock data DO NOT USE IT IN PROD!!!!!
// router.post("/:blob", [], TanksController.insertManytanks);

router.get(
	"/",
	[isValidToken, protectRouteByRole(Role.Specialist)],
	TanksController.getAllTanksWithDetails,
);
router.post(
	"/",
	[isValidToken, protectRouteByRole(Role.Specialist)],
	TanksController.insertATank,
);

router.get(
	"/:id",
	[isValidToken, protectRouteByRole(Role.Specialist)],
	async (req: Request, res: Response) => {
		res.status(200).json({ message: `Get Tank by ID: ${req.params.id}` });
	},
);

router.put(
	"/:id",
	[isValidToken, protectRouteByRole(Role.Specialist)],
	async (req: Request, res: Response) => {
		res.status(200).json({ message: `Update Tank by ID: ${req.params.id}` });
	},
);

router.delete(
	"/:id",
	[isValidToken, protectRouteByRole(Role.Specialist)],
	async (req: Request, res: Response) => {
		res.status(204).send();
	},
);
