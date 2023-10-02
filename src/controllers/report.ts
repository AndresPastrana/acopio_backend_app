import { Request, Response } from "express";
import { Types } from "mongoose";
import { handleResponse } from "./../middleware/index.js";
import { ReportModel } from "./../models/index.js";

// TODO: Validations and error handling
// Validar que es un especiaista y que al trabajador que le esta creando el reporte peretnece a su Base Productiva
// Validar que el prodcutor existe
// Validar que ese pructor no tena ningun reporte generado ese dia
// Asumimos que una vez generado un reporte diario no puede ser editado ni eleminado, solo leido
const createReport = async (req: Request, res: Response) => {
	try {
		const { dayli_collect, producer, productive_base, type_milk } = req.body;
		const oi_producer = new Types.ObjectId(producer);
		const oi_productive_base = new Types.ObjectId(productive_base);
		const report = new ReportModel({
			producer: oi_producer,
			productive_base: oi_productive_base,
			dayli_collect,
			type_milk,
		});
		const result = await report.save();
		return handleResponse({
			data: result,
			msg: "Succes",
			statusCode: 201,
			res,
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

// TODO: validations and error handling
// Valid token 401
// que es especialista jefe de la base que genero el reporte--401
// Required fileds  404
const getReportById = async (req: Request, res: Response) => {
	try {
		const _id = req.params.id;
		const query = ReportModel.findById(new Types.ObjectId(_id)).populate([
			"producer",
			"productive_base",
		]);
		// This can be null HANDLE THIS LATER
		const report = await query.exec();
		return handleResponse({ res, data: report || {}, statusCode: 200 });
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

// TODO: Valdations and error handling
// Validar campos que tienen que venir en la request 404
// Validar tipos de datos de esos campos 404
// Validar token -->401
// Validar que es especialista  -->401
// Validar que el trabajador existe--> 404
// Validar que el especialista es el jefe de la base prod a la que pertenece el trabajador -->401

// ---------->   50...Internal server errror otherwise
const getAllReportsByProducer = async (req: Request, res: Response) => {
	try {
		const producer = req.query.id as string;
		const oi_producer = new Types.ObjectId(producer);
		const query = ReportModel.find({ producer: oi_producer });
		const producer_reports = await query.exec();
		handleResponse({
			res,
			data: producer_reports,
			statusCode: 200,
		});
	} catch (error) {
		const err = error as Error;
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
	getReportById,
};
