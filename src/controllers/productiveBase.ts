import { Request, Response } from "express";
import { Types } from "mongoose";
import { handleResponse } from "./../middleware/index.js";
import { ProductiveBaseModel } from "./../models/index.js";
// Check that the user is an admin
// Check that all the information we need is in the body
// Check that  the the route and state  exist

const insertAProductivebase = async (req: Request, res: Response) => {
	try {
		const { _id = null, ...rest } = req.body;
		const newProductiveBase = new ProductiveBaseModel({ ...rest });
		const result = await newProductiveBase.save();
		const populatedResult = await result.populate(["route", "state"]);
		return handleResponse({
			data: populatedResult,
			msg: "Success",
			statusCode: 201,
			res,
		});
	} catch (error) {
		const err = error as Error;
		return handleResponse({
			msg: "Success",
			statusCode: 404,
			res,
			error: err,
		});
	}
};

// Check that the user is an admin and has a valid token
const getAllProductiveBase = async (req: Request, res: Response) => {
	try {
		const query = ProductiveBaseModel.find({}).populate(["route", "state"]);
		const result = await query.exec();
		return handleResponse({
			msg: "Succes",
			statusCode: 200,
			data: result,
			res,
		});
	} catch (error) {}
};

// Validate that is a valid ObjectI dstring
// Validate that the document exist
const getProductiveBaseById = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const _id = new Types.ObjectId(id);
		const query = ProductiveBaseModel.findById(_id).populate([
			"route",
			"state",
		]);
		const result = await query.exec();

		return handleResponse({
			res,
			data: result ?? {},
			msg: "Success",
			statusCode: 200,
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

// Check that the auth user is a espcialist
// Check all requires values
// Check data type
// Check that  the the route and state  exist
const editProductiveBaseById = async (req: Request, res: Response) => {
	try {
		const { _id = null, id = null, ...rest } = req.body;

		const { id: stringId } = req.params;
		const oid = new Types.ObjectId(stringId);

		const query = ProductiveBaseModel.findByIdAndUpdate(
			oid,
			{
				...rest,
			},
			{ new: true },
		).populate(["route", "state"]);
		const result = await query.exec();

		return handleResponse({
			res,
			data: result ?? {},
			msg: "Success",
			statusCode: 200,
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

const deleteProductiveBaseById = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const oid = new Types.ObjectId(id);

		const query = ProductiveBaseModel.findByIdAndRemove(oid);
		const result = await query.exec();
		return handleResponse({
			res,
			data: result ?? {},
			msg: "Success",
			statusCode: 200,
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
export const ProductiveBaseController = {
	insertAProductivebase,
	getAllProductiveBase,
	getProductiveBaseById,
	editProductiveBaseById,
	deleteProductiveBaseById,
};
