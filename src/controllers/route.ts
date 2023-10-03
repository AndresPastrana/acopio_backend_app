import { Request, Response } from "express";
import { Types } from "mongoose";
import { Route } from "../types.js";
import { handleResponse } from "./../middleware/index.js";
import { RouteModel } from "./../models/index.js";
const insertRoute = async (req: Request, res: Response) => {
	try {
		const route: Route = req.body;
		const newRoute = new RouteModel({ ...route });
		await newRoute.save();
		return handleResponse({
			res,
			statusCode: 201,
			data: {
				route: newRoute,
			},
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
			data: {
				routes,
			},
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
		const { id = "" } = req.params;
		const { name = "" } = req.body;
		const _id = new Types.ObjectId(id);
		const query = RouteModel.findByIdAndUpdate(_id, { name }, { new: true });
		const result = await query.exec();

		console.log("Controler");

		return handleResponse({
			res,
			statusCode: 200,
			data: {
				route: result,
			},
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
		const { id } = req.params;
		const result = await RouteModel.findByIdAndDelete(new Types.ObjectId(id));
		return handleResponse({
			res,
			statusCode: 200,
			data: {
				route: result,
			},
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
