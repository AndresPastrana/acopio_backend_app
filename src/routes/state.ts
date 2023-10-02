import { Router } from "express";
import { StateController } from "../controllers/state.js";

export const router = Router();

router.post("/", StateController.insertState);
router.get("/:id_province", StateController.getStatesByProvinceId);
router.get("/", StateController.getStates);
router.delete("/", StateController.deleteState);
router.put("/:id", StateController.editState);
