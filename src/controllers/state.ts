import { Request, Response } from "express";
import { Types } from "mongoose";
import { StateModel } from "../models/index.js";

// "id_state" : 1886,
const insertState = (req: Request, resp: Response) => {
	const states = [];
};

const editState = (req: Request, resp: Response) => {
	try {
	} catch (error) {}
};

const deleteState = (req: Request, resp: Response) => {
	try {
	} catch (error) {}
};

// Get al the states given an id_province
const getStatesByProvinceId = async (req: Request, resp: Response) => {
	try {
		const { id_province } = req.params;
		const province = new Types.ObjectId(id_province);
		const query = StateModel.find({ province }).populate("province");
		const results = await query.exec();
		return resp.json(results);
	} catch (error) {
		return resp.json(error);
	}
};

const getStates = async (req: Request, resp: Response) => {
	try {
		const query = StateModel.find({}).populate("province");
		const results = await query.exec();
		return resp.json({ data: { states: results } });
	} catch (error) {}
};

export const StateController = {
	insertState,
	editState,
	deleteState,
	getStates,
	getStatesByProvinceId,
};
