import { Router } from "express";
import { ReportController } from "./../controllers/index.js";

export const router = Router();

router.post("/", ReportController.createReport);
router.get("/producer", ReportController.getAllReportsByProducer);
router.get("/:id", ReportController.getReportById);
