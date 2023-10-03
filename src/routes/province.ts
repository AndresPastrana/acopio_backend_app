import { Router } from "express";
import { ProvinceController } from "../controllers/province.js";

export const router = Router();

// Podemos usar este endpoint en caso de que queramos expander la aplicación a otras provincias del pais
// POST: /province
// router.post(
// 	"/",
// 	[isValidToken, protectRouteByRole([Role.Admin])],
// 	ProvinceController.insertProvince,
// );
// router.delete("/", ProvinceController.deleteProvince);
// router.put("/:id", ProvinceController.editProvince);

router.get("/", ProvinceController.getProvinces);
