import { Request, Response } from "express";
import { Types } from "mongoose";
import { Route } from "../types.js";
import { RouteModel } from "./../models/index.js";
const insertRoute = async (req: Request, res: Response) => {
	try {
		const route: Route = req.body;
		const newRoute = new RouteModel({ ...route });
		await newRoute.save();
		return res.json({
			ok: true,
			data: {
				route: newRoute,
			},
		});
	} catch (error) {
		return res
			.json({
				ok: false,
				error,
			})
			.status(500);
	}
};

const getAllRoutes = async (req: Request, res: Response) => {
	try {
		const query = RouteModel.find({});
		const routes = await query.exec();
		return res.json({
			ok: true,
			data: {
				routes,
			},
		});
	} catch (error) {}
};

const getRouteById = (req: Request, res: Response) => {};

const editRoute = async (req: Request, res: Response) => {
	try {
		const { id = "" } = req.params;
		const { name = "" } = req.body;
		const _id = new Types.ObjectId(id);
		const query = RouteModel.findByIdAndUpdate(_id, { name }, { new: true });
		const result = await query.exec();

		return res.json({
			data: {
				route: result,
			},
		});
	} catch (error) {
		return res.json({
			ok: false,
			error,
		});
	}
};

const deleteRoutes = async () => {
	try {
	} catch (error) {}
};

// Just for development proupurse
const insertManyRoutes = async (req: Request, res: Response) => {
	try {
		const routesCollection: Array<Route> = req.body?.routes;
		const newRoutes = await RouteModel.insertMany(routesCollection);
		return res.json({
			data: {
				routes: newRoutes,
			},
		});
	} catch (error) {
		res.json({
			ok: false,
			error,
		});
	}
};

export const RouteController = {
	insertRoute,
	deleteRoutes,
	getAllRoutes,
	editRoute,
	getRouteById,
	insertManyRoutes,
};
