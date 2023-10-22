import { Request, Response } from "express";
import { matchedData } from "express-validator";
import { Types } from "mongoose";
import { handleResponse } from "../middleware/index.js";
import { TankModel } from "../models/index.js";


// const insertManytanks = async (req: Request, resp: Response) => {
// 	const newTanks = [];
// 	try {
// 		const states = await StateModel.find({}).select("name");
// 		for (let i = 0; i < tanks.length; i++) {
// 			const { municipio, capacidad, direccion, nombre, ruta } = tanks[i];
// 			const regExp = new RegExp(municipio, "i");
// 			const state = states.find(({ name }) => regExp.test(name));
// 			if (state) {
// 				const { _id } = state;
// 				const newTank = new TankModel({
// 					address: direccion,
// 					name: nombre,
// 					route: ruta,
// 					capacity: capacidad === 0 ? 500 : capacidad,
// 					state: _id,
// 				});

// 				await newTank.save();
// 			}
// 		}
// 		resp.json({ ok: true });
// 	} catch (error) {
// 		return resp.json(error);
// 	}
// };

const getAllTanksWithDetails = async (req: Request, resp: Response) => {
	try {
		const query = TankModel.find({}).populate(["routes", "state"]);
		const result = await query.exec();
		return handleResponse({
			data: result,
			statusCode: 200,
			res: resp,
		});
	} catch (error) {
		return handleResponse({
			res: resp,
			statusCode: 500,
			error,
		});
	}
};

const getTankByIdWithDetails = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const tank = await TankModel.findById(id).populate(["routes", "state"]);
		return handleResponse({ res, data: tank, statusCode: 200 });
	} catch (error) {
		return handleResponse({
			res,
			statusCode: 500,
			error,
		});
	}
};
// Just an admin can insert a new tank
// Verify that there is no tank with that name
const insertATank = async (req: Request, res: Response) => {
	try {
		const data = matchedData(req)
		const newTank = new TankModel({ ...data });
		const result = await newTank.save();
		const tankWithDetails = await result.populate("routes");

		return handleResponse({
			data: tankWithDetails ,
			res,
			statusCode: 201,
		});
	} catch (error) {
		const e = error as Error;
		return handleResponse({
			res,
			statusCode: 500,
			msg: "Faliure",
			error: e,
		});
	}
};

const udpateATank = async (req: Request, res: Response) => {
	try {

		const {id,...data} = matchedData(req,{locations:['params','body']})
    
		const oid = new Types.ObjectId(req.params.id);
         
		  
		const regexp = new RegExp(data.name, "i")
		const doc = await TankModel.findOne({	$and: 
			[
			{ _id: { $ne: id } },
			{ $or: [{ name: regexp }] },
		],})
	
		
		if (doc) {
		  return handleResponse({
			res,
			statusCode:404,
			error:"Name must be unquie 2"
		  })	
		}
        
		const query = TankModel.findByIdAndUpdate(oid, { ...data }, { new: true });
		const tankWithDetails = await query.populate(["routes",'state']);

		return handleResponse({
			data: tankWithDetails,
			res,
			statusCode: 201,
		});
	} catch (error) {
		const e = error as Error;
		return handleResponse({
			res,
			statusCode: 500,
			msg: "Faliure",
			error: e,
		});
	}
};

export const TanksController = {
	getAllTanksWithDetails,
	insertATank,
	getTankByIdWithDetails,
	udpateATank,
};
