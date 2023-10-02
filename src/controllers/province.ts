import { Request, Response } from "express";
import { ProvinceModel } from "./../models/index.js";

const insertProvince = async (req: Request, resp: Response) => {
	const { name } = req.body;

	try {
		const province = new ProvinceModel({
			name,
		});

		await province.save();
		return resp.json({
			data: {
				province,
			},
		});
	} catch (error) {
		return resp.json(error);
	}
};

const editProvince = (req: Request, resp: Response) => {
	try {
	} catch (error) {}
};

const deleteProvince = (req: Request, resp: Response) => {
	try {
	} catch (error) {}
};

const getProvinces = async (req: Request, resp: Response) => {
	try {
		const p = await ProvinceModel.find({});
		return resp.json({
			data: {
				provinces: p,
			},
		});
	} catch (error) {}
};

export const ProvinceController = {
	insertProvince,
	editProvince,
	deleteProvince,
	getProvinces,
};
