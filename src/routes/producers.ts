import { Request, Response, Router } from "express";
import { isValidToken, protectRouteByRole } from "../middleware/index.js";
import { Role } from "../types.d.js";
import { ProducerController } from "./../controllers/index.js";
export const router = Router();

router.post(
	"/",
	[isValidToken, protectRouteByRole([Role.Specialist])],
	ProducerController.insertProducer,
);

router.get(
	"/",
	[isValidToken, protectRouteByRole([Role.Specialist])],
	async (req: Request, res: Response) => {
		res.status(200).json({ message: "Get all Producers here" });
	},
);

router.get("/:productive_base", ProducerController.getAllProducers);

router.put(
	"/:id",
	[isValidToken, protectRouteByRole([Role.Specialist])],
	async (req: Request, res: Response) => {
		res
			.status(200)
			.json({ message: `Update Producer by ID: ${req.params.id}` });
	},
);

router.delete(
	"/:id",
	[isValidToken, protectRouteByRole([Role.Specialist])],
	async (req: Request, res: Response) => {
		res.status(204).send();
	},
);
