import { Router } from "express";
import { body, param, query } from "express-validator";
import { isValidObjectId, Types } from "mongoose";
import { Months, monthsContractsDefault } from "../const.js";
import {
  mergeMonthContratcs,
  validateCi,
  validateNoDuplicateMonths,
} from "../helpers/index.js";
import {
  isValidDoc,
  isValidToken,
  protectRouteByRole,
} from "../middleware/index.js";
import { Role } from "../types.d.js";
import { ProducerController } from "./../controllers/index.js";
import { validateRequest } from "./../middleware/index.js";
import { ProducerModel } from "./../models/index.js";
import { log } from "console";
export const router = Router();

const authvalidations = [isValidToken, protectRouteByRole([Role.Specialist])];
const createProducerValidations = [
  body("ci").custom((ci) => {
    if (validateCi(ci)) {
      return true;
    }

    throw new Error("Invalid ci");
  }),
  body(["firstname", "surename"], "Invalid value")
    .exists({ values: "null" })
    .isString(),
  body(["secondname", "second_surename"], "Should be a string")
    .isString()
    .optional(),
  body("cant_animals", "Should be an inetger number").isInt().optional(),
  body("months_contracts")
    .isArray({ min: 1, max: 12 })
    .withMessage("Array >1 <12")
    .optional(),
  body("months_contracts")
    .custom((value) => validateNoDuplicateMonths(value))
    .withMessage("Duplicate months in the contracts")
    .optional(),
  body(["months_contracts.*.cant", "months_contracts.*.month"])
    .exists({ values: "null" })
    .withMessage("cant and month are required"),

  body(["months_contracts.*.cant"])
    .isInt()
    .withMessage("cant must  be an integer"),
  body(["months_contracts.*.month"])
    .isIn(Object.values(Months))
    .withMessage(`month must be in ${Object.values(Months)}`),
  body("months_contracts")
    .customSanitizer((months_contracts) => {
      try {
        const merged = mergeMonthContratcs({
          defaults: monthsContractsDefault,
          replacer: months_contracts,
        });
        return merged;
      } catch (error) {
        throw error;
      }
    })
    .optional(),
];

const idQueryValidator = [
  query("id")
    .exists({ values: "falsy" })
    .withMessage("Id is required")
    .isMongoId()
    .withMessage("Invalid id")
    .if((id) => isValidObjectId(id))
    .custom((id) => isValidDoc(id, ProducerModel))
    .withMessage("Invalid producer id")
    .customSanitizer((id) => new Types.ObjectId(id))
    .optional(),
];
const idParamValidations = [
  param("id")
    .exists({ values: "null" })
    .withMessage("id param is required")
    .isMongoId()
    .withMessage("Invalid Mongo id")
    .if((id) => isValidObjectId(id))
    .custom((id) => isValidDoc(id, ProducerModel))
    .withMessage("Invalid producer id")
    .customSanitizer((id) => new Types.ObjectId(id)),
];

const updateValidtions = [
  body(
    ["firstname", "surename", "secondname", "second_surename"],
    "Invalid value"
  )
    .isString()
    .optional(),
  body("cant_animals", "Should be an inetger number").isInt().optional(),
  body("ci")
    .custom((ci) => {
      if (validateCi(ci)) {
        return true;
      }

      throw new Error("Invalid ci");
    })
    .optional(),
  body("months_contracts")
    .isArray({ min: 1, max: 12 })
    .withMessage("Array >1 <12")
    .optional(),
  body("months_contracts")
    .custom((value) => validateNoDuplicateMonths(value))
    .withMessage("Duplicate months in the contracts")
    .optional(),
  body(["months_contracts.*.cant", "months_contracts.*.month"])
    .exists({ values: "null" })
    .withMessage("cant and month are required"),

  body(["months_contracts.*.cant"])
    .isInt()
    .withMessage("cant must  be an integer"),
  body(["months_contracts.*.month"])
    .isIn(Object.values(Months))
    .withMessage(`month must be in ${Object.values(Months)}`),
];

router.post(
  "/",
  [...authvalidations, ...createProducerValidations, validateRequest],
  ProducerController.insertProducer
);

router.get(
  "/",
  [...authvalidations, ...idQueryValidator, validateRequest],
  ProducerController.getProducers
);
// PUT /producer/651efdc3710165dfd75b6780

// TODO:
// validate ci
// Validate month_contracts
router.put("/:id", [
  ...authvalidations,
  ...idParamValidations,
  ...updateValidtions,
  validateRequest,
  ProducerController.editProducer,
]);

router.delete(
  "/:id",
  [...authvalidations, ...idParamValidations, validateRequest],
  ProducerController.deleteProducer
);

router.get(
  "/cumplidores/:month",
  [
    ...authvalidations,
    param("month").isIn(Object.values(Months)).withMessage("Invalid Month"),
  ],
  ProducerController.getCumplidoresList
);
