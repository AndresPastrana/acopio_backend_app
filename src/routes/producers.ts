import { Router } from "express";
import { ProducerController } from "./../controllers/index.js";
export const router = Router();

router.post("/", ProducerController.insertProducer);

router.get("/", async (req, res) => {
	res.status(200).json({ message: "Get all Producers here" });
});

router.get("/:productive_base", ProducerController.getAllProducers);

router.put("/:id", async (req, res) => {
	res.status(200).json({ message: `Update Producer by ID: ${req.params.id}` });
});

router.delete("/:id", async (req, res) => {
	res.status(204).send();
});
