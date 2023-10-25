import { Request, Response, Router } from "express";
import { body, matchedData, param, query } from "express-validator";
import { Types, isValidObjectId } from "mongoose";
import {
  isValidDoc,
  isValidToken,
  protectRouteByRole,
  validateRequest,
} from "../middleware/index.js";
import { MilkType, Role } from "../types.d.js";
import { ReportController } from "./../controllers/index.js";
import { ProducerModel, ReportModel } from "./../models/index.js";
export const router = Router();

const authValidations = [isValidToken, protectRouteByRole([Role.Specialist])];

const createReportvalidations = [
  body("dayli_collect").isInt().withMessage("dayli_collect must be a integer"),
  body("type_milk")
    .isIn(Object.values(MilkType))
    .withMessage(`type_milk must be one of ${Object.values(MilkType)}`),
  body("producer")
    .isMongoId()
    .withMessage("Invalid producer id")
    .if((id) => isValidObjectId(id))
    .custom((id) => isValidDoc(id, ProducerModel))
    .withMessage("Producer not found")
    .customSanitizer((id) => new Types.ObjectId(id)),
];
// POST /report
router.post(
  "/",
  [...authValidations, ...createReportvalidations, validateRequest],
  ReportController.createReport
);

// GET /report?producer=3743vn3hcc3n3c53

router.get(
  "/by-productive-base",
  [...authValidations, validateRequest],
  ReportController.getReportsByProductiveBase
);
