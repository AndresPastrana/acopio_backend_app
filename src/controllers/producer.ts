import { Request, Response } from "express";
import { Types } from "mongoose";
import { ProducerModel } from "../models/index.js";
import { handleResponse } from "./../middleware/index.js";
// TODO: solo el especialist de una base puede Editar,Insertar,Eliminar y ver la informacion de lso prodcutores de subase

// Insertar un nuveo prodcutor
// id base, id_prodcutor, especialista permission
// TODO:
// Validar que en el body viene la base, el prodcutor, el carnet de identida, nombre
// los demas campos no on requeridos por el modelo aunque pueden venir
// Validar el id de la base y el productor como un ObjectId
// Validar que tanto la base como el productor existan
const insertProducer = async (req: Request, res: Response) => {
	try {
		const data = req.body;
		const productive_base = new Types.ObjectId(data.productive_base);
		const producer = new ProducerModel({
			...data,
			productive_base,
		});
		const result = await producer.save();
		const populatedResult = await result.populate(["productive_base"]);
		return handleResponse({
			res,
			msg: "Succces",
			statusCode: 201,
			data: populatedResult,
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
// Editar el productor
// id base, id_prodcutor, especialista permission
const editProducer = async (req: Request, res: Response) => {};
// Obtener todos los productores de una base productiva
// id base, especialista permission
// Validar el id de la base y el productor como un ObjectId
// Validar que tanto la base como el productor existan
const getAllProducers = async (req: Request, res: Response) => {
	try {
		const { productive_base } = req.params;
		const query = ProducerModel.find({
			productive_base: new Types.ObjectId(productive_base),
		}).populate("productive_base");

		const resutl = await query.exec();

		return handleResponse({
			res,
			msg: "Succces",
			statusCode: 201,
			data: resutl,
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

// Obtener los datos de un productor de una base productivas
// id base, especialista permission
const getProducerbuId = async (req: Request, res: Response) => {};
// Borrar un productor de una base productiva
// id base, id_productor, especialista permission
const deleteProducer = async (req: Request, res: Response) => {};

export const ProducerController = {
	insertProducer,
	getAllProducers,
	getProducerbuId,
	deleteProducer,
	editProducer,
};
