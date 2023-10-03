import { Router } from "express";
import { ProvinceController } from "../controllers/province.js";
import { Role } from "../types.d.js";
import { isValidToken, protectRouteByRole } from "./../middleware/index.js";

export const router = Router();

router.post(
	"/",
	[isValidToken, protectRouteByRole(Role.Specialist)],
	ProvinceController.insertProvince,
);
router.get("/", ProvinceController.getProvinces);
// router.delete("/", ProvinceController.deleteProvince);
// router.put("/:id", ProvinceController.editProvince);
