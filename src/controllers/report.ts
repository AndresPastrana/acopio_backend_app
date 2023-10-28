import { Request, Response } from "express";
import { Types } from "mongoose";
import { handleResponse } from "./../middleware/index.js";
import { ProducerModel, ReportModel, UserModel } from "./../models/index.js";
import { Payload } from "../types.js";
import { matchedData } from "express-validator";

const createReport = async (
  req: Request & {
    user?: Payload;
  },
  res: Response
) => {
  try {
    const { producer = null, ...rest } = matchedData(req);
    // PB of the loged user
    const pb = req?.user?.productiveBaseInCharge || null;

    if (!pb || !producer) {
      return handleResponse({
        res,
        error: "Invalid req",
        statusCode: 404,
      });
    }

    const pr = await ProducerModel.findOne({
      _id: producer,
      productive_base: new Types.ObjectId(pb), //Base Productiva del usuario auth
    });

    if (!pr) {
      return handleResponse({
        res,
        error: "Producer not found in your productive base",
        statusCode: 404,
      });
    }

    const report = await ReportModel.create({
      ...rest,
      producer,
      productive_base: pb,
    });

    const reportWithDetails = await report.populate([
      "productive_base",
      "producer",
    ]);

    return handleResponse({
      res,
      data: reportWithDetails,
      statusCode: 201,
      msg: "New Report created successfully",
    });
  } catch (error) {
    const err = error as Error;
    return handleResponse({
      msg: "faliure",
      statusCode: 404,
      res,
      error: err,
    });
  }
};

// TODO: FIX THIS AND OTHERS CONTROLLERS
const getReportsByProductiveBase = async (
  req: Request & {
    user?: Payload;
  },
  res: Response
) => {
  try {
    // Access the user's productive base from req.user
    const productiveBase = req.user?.productiveBaseInCharge;

    if (!productiveBase) {
      return handleResponse({
        res,
        statusCode: 400,
        error: "User's productive base not found",
      });
    }
    const query = ReportModel.find({
      productive_base: new Types.ObjectId(productiveBase),
    }).populate("producer", ["firstname", "surename", "cant_animals", "ci"]);

    const reports = await query.exec();

    return handleResponse({
      res,
      data: reports,
      statusCode: 200,
    });
  } catch (error) {
    const err = error as Error;

    return handleResponse({
      res,
      statusCode: 500,
      error: err.message,
    });
  }
};

export const ReportController = {
  createReport,
  getReportsByProductiveBase,
};
