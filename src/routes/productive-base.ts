import { Router } from "express";
import { ProductiveBaseController } from "../controllers/index.js";
import { Role } from "../types.d.js";
import { isValidToken, protectRouteByRole } from "./../middleware/index.js";
export const router = Router();

// Private routes
router.post(
	"/",
	[isValidToken, protectRouteByRole([Role.Admin])],
	ProductiveBaseController.insertAProductivebase,
);

router.get(
	"/",
	[isValidToken, protectRouteByRole([Role.Admin])],
	ProductiveBaseController.getAllProductiveBase,
);

// Get productive-base/368473chchx8746378x
router.get(
	"/:id",
	[isValidToken, protectRouteByRole([Role.Admin, Role.Specialist])],
	ProductiveBaseController.getProductiveBaseById,
);

router.put(
	"/:id",
	[isValidToken, protectRouteByRole([Role.Admin])],
	ProductiveBaseController.editProductiveBaseById,
);

router.delete(
	"/:id",
	[isValidToken, protectRouteByRole([Role.Admin])],
	ProductiveBaseController.deleteProductiveBaseById,
);
