import { Router } from "express";
import { isValidToken, protectRouteByRole } from "../middleware/index.js";
import { Role } from "../types.d.js";
import { ReportController } from "./../controllers/index.js";
export const router = Router();

// POST /report
router.post(
	"/",
	[isValidToken, protectRouteByRole(Role.Specialist)],
	ReportController.createReport,
);

// GET /report/producer?id=3743vn3hcc3n3c53
router.get(
	"/producer",
	[isValidToken, protectRouteByRole(Role.Specialist)],
	ReportController.getAllReportsByProducer,
);

// GET /report/reportid
router.get(
	"/:id",
	[isValidToken, protectRouteByRole(Role.Specialist)],
	ReportController.getReportById,
);
