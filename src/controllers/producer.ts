import { Request, Response } from "express";
import { caluculateAge } from "../helpers/age.js";
import { ProducerModel, ReportModel } from "../models/index.js";
import { handleResponse } from "./../middleware/index.js";
import { matchedData } from "express-validator";
import { Payload, Producer } from "../types.js";
import { monthsContractsDefault } from "../const.js";
import {
  getStartAndEndDateForMonth,
  mergeMonthContratcs,
} from "../helpers/index.js";
import { Types } from "mongoose";
import { log } from "console";
import { type } from "os";

const insertProducer = async (
  req: Request & {
    user?: Payload;
  },
  res: Response
) => {
  try {
    const {
      ci,
      firstname,
      surename,
      secondname = "",
      second_surename = "",
      cant_animals = 0,
      months_contracts = monthsContractsDefault,
    } = matchedData(req);
    const age = caluculateAge(ci);

    // Check for a user
    if (!req.user) {
      return handleResponse({ res, statusCode: 401, error: "Unathorized" });
    }

    const newProducer = {
      ci,
      firstname,
      secondname,
      surename,
      second_surename,
      cant_animals,
      productive_base: new Types.ObjectId(req.user.productiveBaseInCharge),
      months_contracts,
      age,
    };

    const producer = new ProducerModel(newProducer);

    const result = await producer.save();
    const populatedResult = await result.populate(["productive_base"]);

    return handleResponse({
      res,
      msg: "Succces",
      statusCode: 201,
      data: populatedResult,
    });
  } catch (error) {
    console.log(error);

    return handleResponse({ res, error, statusCode: 500 });
  }
};

const editProducer = async (req: Request, res: Response) => {
  try {
    const {
      id,
      ci = null,
      age = null,
      productive_base = null,
      months_contracts = null,
      ...rest
    } = matchedData(req, { locations: ["body", "params"] });

    const doc = await ProducerModel.findById(id);

    if (doc) {
      if (ci) {
        doc.age = caluculateAge(ci);
      }

      if (months_contracts) {
        const mixedMonthsContracts = mergeMonthContratcs({
          defaults: doc.months_contracts || monthsContractsDefault,
          replacer: months_contracts,
        });

        doc.months_contracts = mixedMonthsContracts;
      }

      // Update age and ci
      await doc.save();

      // Update the rest of the props
      const d = ProducerModel.findByIdAndUpdate(id, { ...rest }, { new: true });
      const withPBDetails = await d.populate("productive_base");
      return handleResponse({
        res,
        statusCode: 200,
        data: withPBDetails,
      });
    }

    //

    const query = ProducerModel.findByIdAndUpdate(
      id,
      { ...rest },
      { new: true }
    );
    const result = await query.exec();
    return handleResponse({ res, data: result, statusCode: 201 });
  } catch (error) {
    return handleResponse({ res, statusCode: 500, error });
  }
};

const getProducers = async (
  req: Request & {
    user?: Payload;
  },
  res: Response
) => {
  try {
    const { id = null } = matchedData(req, { locations: ["query"] });
    if (!req.user) {
      return handleResponse({ res, statusCode: 401, error: "Unathorized" });
    }

    const filter: { productive_base: Types.ObjectId; _id?: Types.ObjectId } = {
      productive_base: new Types.ObjectId(req.user.productiveBaseInCharge),
    };

    if (id) {
      filter._id = id;
    }

    const query = ProducerModel.find(filter);

    const resutl = await query.exec();

    return handleResponse({
      res,
      msg: "Succces",
      statusCode: 200,
      data: resutl,
    });
  } catch (error) {
    return handleResponse({ res, error, statusCode: 500 });
  }
};

const getCumplidoresList = async (
  req: Request & {
    user?: Payload;
  },
  res: Response
) => {
  try {
    // const cumplidores: Producer = [];
    // const noCumpl: Producer = [];

    // Target month
    const { month } = matchedData(req, { locations: ["params"] });

    // Get target productive base
    const targetProductiveBase = req.user?.productiveBaseInCharge;

    // Get the range of dates
    const { startDate, endDate } = getStartAndEndDateForMonth(month);

    const generatedReports = await ReportModel.find({
      productive_base: new Types.ObjectId(targetProductiveBase),
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    type MyObjectType = {
      [producerId: string]: number;
    };

    const initValue: MyObjectType = {};

    // Agrupar los reportes por trabajador
    const reportsGroupByProducer = generatedReports.reduce(
      (acm, currentValue) => {
        const producerId = currentValue.producer.toString();
        const { dayli_collect } = currentValue;

        const castedDayliCollect = dayli_collect as number;

        // Create a copy of the current producer's reports or an empty array
        const producerCollect = acm[producerId] || 0;

        //  Increas the producer coolect with the current value
        const totalCollect = producerCollect + castedDayliCollect;

        // Add the current report to the producer's reports
        // producerReports.push({ id, dayli_collect, type_milk });

        // Update the accumulator with the new producer reports
        return { ...acm, [producerId]: totalCollect };
      },
      initValue
    );

    // Get all the months_contracts de esos trabajadores
    const prodcuers = await ProducerModel.find({
      _id: {
        $in: Object.keys(reportsGroupByProducer).map(
          (id) => new Types.ObjectId(id)
        ),
      },
    }).select(["months_contracts"]);

    // Obtener el total de trabajadores de la base
    const totalProducers = await ProducerModel.find({
      productive_base: targetProductiveBase,
    }).count();

    type ComplianceStatus = {
      compliantWorkers: number;
      nonCompliantWorkers: number;
      totalProducers: number;
    };
    // Iterate over all the prdoducers
    let data: ComplianceStatus = {
      compliantWorkers: 0,
      nonCompliantWorkers: 0,
      totalProducers,
    };

    for (const producer of prodcuers) {
      const { id, months_contracts } = producer;
      if (!months_contracts) return;
      // Iterate over his contracts to fnd the month
      const index = months_contracts.findIndex(
        (contract) => contract.month === month
      );

      if (reportsGroupByProducer[id] >= months_contracts[index].cant) {
        // Es cumplidor
        data.compliantWorkers += 1;
      } else {
        // No es cumplidor
        data.nonCompliantWorkers += 1;
      }
    }

    return handleResponse({
      res,
      data,
      statusCode: 200,
    });
  } catch (error) {
    const err = error as Error;
    return handleResponse({
      res,

      statusCode: 500,
      error: err,
    });
  }
};

// Borrar un productor de una base productiva
// id base, id_productor, especialista permission
const deleteProducer = async (
  req: Request & {
    user?: Payload;
  },
  res: Response
) => {
  //Producer id

  // Get the productive base of the loged user
  try {
    const { id = "" } = matchedData(req, { locations: ["params"] });
    const producer = await ProducerModel.findOne({
      _id: id,
      productive_base: new Types.ObjectId(req.user?.productiveBaseInCharge),
    });

    if (!producer) {
      return handleResponse({
        res,
        statusCode: 404,
        msg: "Producer not found",
        error: "Bad Request",
      });
    }
    const deleted = await producer.deleteOne({ new: true });
    return handleResponse({
      res,
      data: deleted,
      statusCode: 204,
    });
  } catch (error) {
    return handleResponse({ res, statusCode: 500, error });
  }
};

export const ProducerController = {
  insertProducer,
  getProducers,
  deleteProducer,
  editProducer,
  getCumplidoresList,
};
