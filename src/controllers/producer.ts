import { Request, Response } from "express";
import { Types } from "mongoose";
import { caluculateAge } from "../helpers/age.js";
import { ProducerModel } from "../models/index.js";
import { handleResponse } from "./../middleware/index.js";
import { UserModel } from "./../models/index.js";

const insertProducer = async (req: Request, res: Response) => {
	try {
		const {
			months_contracts = null,
			_id = null,
			id = null,
			productive_base = null,
			...rest
		} = req.body;
		const age = caluculateAge(rest.ci);

		const newProducer = {
			...rest,
			productive_base: new Types.ObjectId(productive_base),
			age,
		};

		const producer = new ProducerModel(newProducer);

		const result = await producer.save();
		const populatedResult = await result.populate(["productive_base"]);

		return handleResponse({
			res,
			msg: "Succces",
			statusCode: 201,
			data: {
				producer,
			},
		});
	} catch (error) {
		return handleResponse({ res, error, statusCode: 500 });
	}
};

const editProducer = async (req: Request, res: Response) => {
	try {
		const { ci = null, productive_base = null, age = null, ...rest } = req.body;
		const _id = new Types.ObjectId(req.query?.id as string);
		const query = ProducerModel.findByIdAndUpdate(
			_id,
			{ ...rest },
			{ new: true },
		);
		const result = await query.exec();
		return handleResponse({ res, data: { producer: result }, statusCode: 201 });
	} catch (error) {
		return handleResponse({ res, statusCode: 500, error });
	}
};

const getProducers = async (req: Request, res: Response) => {
	try {
		const { productiveBase = null, id = null } = req.query;
		const filter =
			id === "all"
				? { productive_base: new Types.ObjectId(productiveBase as string) }
				: {
						productive_base: new Types.ObjectId(productiveBase as string),
						_id: new Types.ObjectId(id as string),
				  };

		const query = ProducerModel.find(filter);

		const resutl = await query.exec();

		return handleResponse({
			res,
			msg: "Succces",
			statusCode: 200,
			data: { producers: resutl },
		});
	} catch (error) {
		return handleResponse({ res, error, statusCode: 500 });
	}
};

// Borrar un productor de una base productiva
// id base, id_productor, especialista permission
const deleteProducer = async (req: Request, res: Response) => {
	//Producer id

	try {
		const producer_id = new Types.ObjectId(req.params.id);
		const auth_user_id = new Types.ObjectId(req?.user.uid);

		const authUser = await UserModel.findById(auth_user_id);
		const producerToDelete = await ProducerModel.findById(producer_id);

		console.log("Auth user");
		console.log(authUser);
		console.log("producerToDelete");
		console.log(producerToDelete);

		if (
			authUser?.productiveBaseInCharge.toString() ===
			producerToDelete?.productive_base.toString()
		) {
			await ProducerModel.findByIdAndDelete(producer_id);
			return handleResponse({
				res,
				data: {
					producer: producerToDelete,
				},
				statusCode: 200,
			});
		}

		return handleResponse({
			res,
			error: new Error(`No existe el productor ${producerToDelete?.firstname}`),
			statusCode: 400,
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
