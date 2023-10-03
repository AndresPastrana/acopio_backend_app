import { NextFunction, Request, Response, Router } from "express";
import { isValidToken, protectRouteByRole } from "../middleware/index.js";
import { Role } from "../types.d.js";
import { RouteController } from "./../controllers/index.js";
export const router = Router();
// TODO:6 work here
// router.post("/:blob", [], RouteController.insertManyRoutes);
router.post(
	"/",
	[
		isValidToken,
		(req: Request, res: Response, next: NextFunction) =>
			protectRouteByRole(req, res, next, Role.Admin),
	],
	RouteController.insertRoute,
);

router.get(
	"/",
	[
		isValidToken,
		(req: Request, res: Response, next: NextFunction) =>
			protectRouteByRole(req, res, next, Role.Admin),
	],
	RouteController.getAllRoutes,
);

router.get(
	"/:id",
	[
		isValidToken,
		(req: Request, res: Response, next: NextFunction) =>
			protectRouteByRole(req, res, next, [Role.Admin, Role.Specialist]),
	],
	RouteController.getRouteById,
);

router.put(
	"/:id",
	[
		isValidToken,
		(req: Request, res: Response, next: NextFunction) =>
			protectRouteByRole(req, res, next, Role.Admin),
	],
	RouteController.editRoute,
);

router.delete(
	"/:id",
	[
		isValidToken,
		(req: Request, res: Response, next: NextFunction) =>
			protectRouteByRole(req, res, next, Role.Admin),
	],
	RouteController.deleteRoutes,
);
