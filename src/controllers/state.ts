import { Request, Response } from "express";
import { Types } from "mongoose";
import { StateModel } from "../models/index.js";
import { handleResponse } from "./../middleware/index.js";

// const insertState = (req: Request, resp: Response) => {
// 	const states = [];
// };

// const editState = (req: Request, resp: Response) => {
// 	try {
// 	} catch (error) {}
// };

// const deleteState = (req: Request, resp: Response) => {
// 	try {
// 	} catch (error) {}
// };

// Get all the states given an id_province
const getStatesByProvinceId = async (req: Request, res: Response) => {
	try {
		const { id_province } = req.params;
		const province = new Types.ObjectId(id_province);
		const query = StateModel.find({ province }).populate("province");
		const results = await query.exec();
		return handleResponse({
			res,
			statusCode: 200,
			data: results,
		});
	} catch (error) {
		return handleResponse({ error, statusCode: 500, res });
	}
};

const getStates = async (req: Request, res: Response) => {
	try {
		const query = StateModel.find({}).populate("province");
		const results = await query.exec();
		return handleResponse({ res, statusCode: 200, data: { states: results } });
	} catch (error) {
		return handleResponse({ res, statusCode: 500, error });
	}
};

export const StateController = {
	getStates,
	getStatesByProvinceId,
};
