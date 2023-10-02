import { Request, Response, Router } from "express";
import { TanksController } from "./../controllers/index.js";
export const router = Router();

// This endpoint was just created to insert mock data DO NOT USE IT IN PROD!!!!!
// router.post("/:blob", [], TanksController.insertManytanks);

router.get("/", TanksController.getAllTanksWithDetails);
router.post("/", TanksController.insertATank);

router.get("/:id", [], async (req: Request, res: Response) => {
	res.status(200).json({ message: `Get Tank by ID: ${req.params.id}` });
});

router.put("/:id", [], async (req: Request, res: Response) => {
	res.status(200).json({ message: `Update Tank by ID: ${req.params.id}` });
});

router.delete("/:id", [], async (req: Request, res: Response) => {
	res.status(204).send();
});
