import { Request, Response } from "express";
import { handleResponse } from "./../middleware/index.js";
import { ProvinceModel } from "./../models/index.js";

// const insertProvince = async (req: Request, resp: Response) => {
// 	const { name } = req.body;

// 	try {
// 		const province = new ProvinceModel({
// 			name,
// 		});

// 		await province.save();
// 		return resp.json({
// 			data: {
// 				province,
// 			},
// 		});
// 	} catch (error) {
// 		return resp.json(error);
// 	}
// };

// const editProvince = (req: Request, resp: Response) => {
// 	try {
// 	} catch (error) {}
// };

// const deleteProvince = (req: Request, resp: Response) => {
// 	try {
// 	} catch (error) {}
// };

const getProvinces = async (req: Request, res: Response) => {
	try {
		const p = await ProvinceModel.find({});
		return handleResponse({
			data: {
				provinces: p,
			},
			statusCode: 200,
			res,
		});
	} catch (error) {
		return handleResponse({
			error,
			statusCode: 500,
			res,
		});
	}
};

export const ProvinceController = {
	// insertProvince,
	// editProvince,
	// deleteProvince,
	getProvinces,
};
