import { Router } from "express";
import { RouteController } from "./../controllers/index.js";

export const router = Router();
// TODO:6 work here
router.post("/", [], RouteController.insertRoute);
router.post("/:blob", [], RouteController.insertManyRoutes);

router.get("/", [], RouteController.getAllRoutes);

router.get("/:id", [], RouteController.getRouteById);

router.put("/:id", [], RouteController.editRoute);

router.delete("/:id", [], RouteController.deleteRoutes);
