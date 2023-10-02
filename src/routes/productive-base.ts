import { Router } from "express";
import { ProductiveBaseController } from "../controllers/index.js";
export const router = Router();

router.post("/", [], ProductiveBaseController.insertAProductivebase);

router.get("/", [], ProductiveBaseController.getAllProductiveBase);

router.get("/:id", [], ProductiveBaseController.getProductiveBaseById);

router.put("/:id", [], ProductiveBaseController.editProductiveBaseById);

router.delete("/:id", ProductiveBaseController.deleteProductiveBaseById);
