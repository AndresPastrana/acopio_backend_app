import { Router } from "express";
import { ProvinceController } from "../controllers/province.js";

export const router = Router();

router.post("/", ProvinceController.insertProvince);
router.get("/", ProvinceController.getProvinces);
router.delete("/", ProvinceController.deleteProvince);
router.put("/:id", ProvinceController.editProvince);
