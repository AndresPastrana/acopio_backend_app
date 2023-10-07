import { Request, Response } from "express";
import { Types } from "mongoose";
import { handleResponse } from "./../middleware/index.js";
import { ProducerModel, ReportModel, UserModel } from "./../models/index.js";

const createReport = async (req: Request, res: Response) => {
	try {
		const uid = new Types.ObjectId(req?.user.uid as string);
		const producer_id = new Types.ObjectId(req.body.producer);

		const authUser = await UserModel.findById(uid);
		const producer = await ProducerModel.findById(producer_id);

		// TODO chechk that producer.productive_base === authUser.productiveBaseInCharge
		if (
			producer?.productive_base.toString() ===
			authUser?.productiveBaseInCharge.toString()
		) {
			const { dayli_collect = 0, type_milk = null } = req.body;
			const report = new ReportModel({
				producer: producer_id,
				productive_base: authUser?.productiveBaseInCharge,
				dayli_collect,
				type_milk,
			});
			const newReport = await report.save();
			return handleResponse({
				data: { report: newReport },
				msg: "Succes",
				statusCode: 201,
				res,
			});
		}

		return handleResponse({
			res,
			statusCode: 401,
			msg: "The current loged specialist can't generate a report for this porducer",
		});

		// const result = await report.save();
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

const getAllReportsByProducer = async (req: Request, res: Response) => {
	const { producer } = req.query;

	try {
		const uid = new Types.ObjectId(req?.user.uid);
		const producer_id = new Types.ObjectId(req.query.producer);

		const authUser = await UserModel.findById(uid);
		const producer = await ProducerModel.findById(producer_id);

		console.log(producer);
		console.log(authUser);

		const producerReports = await ReportModel.find({
			producer: producer_id,
			productive_base: authUser?.productiveBaseInCharge,
		});
		return handleResponse({
			res,
			data: { reports: producerReports },
			statusCode: 200,
		});
	} catch (error) {
		return handleResponse({
			statusCode: 500,
			res,
			error: err,
		});
	}
};
export const ReportController = {
	createReport,
	getAllReportsByProducer,
};
