import { Request, Response } from "express";
import { matchedData } from 'express-validator';
import { Types } from "mongoose";
import { handleResponse } from "./../middleware/index.js";
import { RouteModel } from "./../models/index.js";
const insertRoute = async (req: Request, res: Response) => {
	try {
		const data= matchedData(req)
		
		const newRoute = new RouteModel({...data});
		await newRoute.save();
		return handleResponse({
			res,
			statusCode: 201,
			data:  newRoute,
			
		});
	} catch (error) {
		return handleResponse({
			res,
			statusCode: 500,
			error,
		});
	}
};

const getAllRoutes = async (req: Request, res: Response) => {
	try {
		const query = RouteModel.find({});
		const routes = await query.exec();
		return handleResponse({
			res,
			data:routes
		,
			statusCode: 200,
		});
	} catch (error) {
		return handleResponse({
			error,
			res,
			statusCode: 500,
		});
	}
};

const getRouteById = (req: Request, res: Response) => {
	res.json({ n: req.params });
};

const editRoute = async (req: Request, res: Response) => {
	try {

		const {id,...rest} = matchedData(req,{locations:['body','params']})
        const oid = new Types.ObjectId(id);
          console.log(id);
		  console.log(rest);
		  
		  
		const doc = await RouteModel.findOne({$and:[ {name: new RegExp(rest.name,'i')} , {_id:{$ne:oid}}]})

		 if (doc) {
			return handleResponse({
				res,
				statusCode:400,
				error:"Duplicate data",
				msg: "name must be unique"
			})
		 }
		
		const query = RouteModel.findByIdAndUpdate(oid, { ...rest}, { new: true });
		const result = await query.exec();

		return handleResponse({
			res,
			statusCode: 200,
			data:result,
		});
	} catch (error) {
		return handleResponse({
			error,
			res,
			statusCode: 500,
		});
	}
};

const deleteRoutes = async (req: Request, res: Response) => {
	try {
	    const {id} = matchedData(req,{locations:['params']})
       const result = await RouteModel.findByIdAndDelete(new Types.ObjectId(id));

		return handleResponse({
			res,
			statusCode: 200,
			data:result,
		});
	} catch (error) {
		return handleResponse({
			res,
			statusCode: 500,
			error,
		});
	}
};

// Just for development proupurse
// const insertManyRoutes = async (req: Request, res: Response) => {
// 	try {
// 		const routesCollection: Array<Route> = req.body?.routes;
// 		const newRoutes = await RouteModel.insertMany(routesCollection);
// 		return res.json({
// 			data: {
// 				routes: newRoutes,
// 			},
// 		});
// 	} catch (error) {
// 		res.json({
// 			ok: false,
// 			error,
// 		});
// 	}
// };

export const RouteController = {
	insertRoute,
	deleteRoutes,
	getAllRoutes,
	editRoute,
	getRouteById,
};
