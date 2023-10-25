import { Request, Response } from "express";
import { caluculateAge } from "../helpers/age.js";
import { ProducerModel } from "../models/index.js";
import { handleResponse } from "./../middleware/index.js";
import { UserModel } from "./../models/index.js";
import { matchedData } from "express-validator";
import { Payload } from "../types.js";
import { monthsContractsDefault } from "../const.js";
import { mergeMonthContratcs } from "../helpers/index.js";
import { Types } from "mongoose";

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
};
