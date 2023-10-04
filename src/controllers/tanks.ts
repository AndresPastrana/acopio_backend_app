import { Request, Response } from "express";
import { Types } from "mongoose";
import { handleResponse } from "../middleware/index.js";
import { TankModel } from "../models/index.js";
import { Tank } from "../types.js";
const tanks = [
	{
		nombre: "La Lima",
		direccion: "****",
		municipio: "Pinar del Río",
		capacidad: 1000,
		ruta: new Types.ObjectId("6516371f125c13a96e347b62"),
	},
	{
		nombre: "En Caliente",
		direccion: "****",
		municipio: "Consolacion del Sur",
		capacidad: 1000,
		ruta: new Types.ObjectId("6516371f125c13a96e347b5e"),
	},
	{
		nombre: "Vaqueria 5",
		direccion: "Autopista",
		municipio: "Pinar del Río",
		capacidad: 1000,
		ruta: new Types.ObjectId("6516371f125c13a96e347b62"),
	},
	{
		nombre: "Vaqueria 7",
		direccion: "Autopista",
		municipio: "Pinar del Río",
		capacidad: 1000,
		ruta: new Types.ObjectId("6516371f125c13a96e347b62"),
	},
	{
		nombre: "Vaqueria 11",
		direccion: "Autopista",
		municipio: "Pinar del Río",
		capacidad: 1000,
		ruta: new Types.ObjectId("6516371f125c13a96e347b62"),
	},
	{
		nombre: "Vaqueria 12",
		direccion: "Autopista",
		municipio: "Pinar del Río",
		capacidad: 1000,
		ruta: new Types.ObjectId("6516371f125c13a96e347b62"),
	},
	{
		nombre: "Beajaca",
		direccion: "Minas de Matahambre",
		municipio: "Viñales",
		capacidad: 1000,
		ruta: new Types.ObjectId("6516371f125c13a96e347b5d"),
	},
	{
		nombre: "Antonio Maceo",
		direccion: "Consolción",
		municipio: "Consolción",
		capacidad: 1000,
		ruta: new Types.ObjectId("6516371f125c13a96e347b5c"),
	},
	{
		nombre: "Vaqueria 13",
		direccion: "Pinar del Río",
		municipio: "Pinar del Río",
		capacidad: 1000,
		ruta: new Types.ObjectId("6516371f125c13a96e347b62"),
	},
	{
		nombre: "Vaqueria 10",
		direccion: "****",
		municipio: "Pinar del Río",
		capacidad: 1000,
		ruta: new Types.ObjectId("6516371f125c13a96e347b62"),
	},
	{
		nombre: "Vaqueria 14",
		direccion: "****",
		municipio: "Pinar del Río",
		capacidad: 1000,
		ruta: new Types.ObjectId("6516371f125c13a96e347b62"),
	},
	{
		nombre: "Vaqueria 8",
		direccion: "****",
		municipio: "Pinar del Río",
		capacidad: 1000,
		ruta: new Types.ObjectId("6516371f125c13a96e347b62"),
	},
	{
		nombre: "Caliente",
		direccion: "Pinar del Río",
		municipio: "Pinar del Río",
		capacidad: 1000,
		ruta: new Types.ObjectId("6516371f125c13a96e347b60"),
	},
	{
		nombre: "Camilo Cienfuego",
		direccion: "***",
		municipio: "Palacios",
		capacidad: 1000,
		ruta: new Types.ObjectId("6516371f125c13a96e347b61"),
	},
	{
		nombre: "Abel Santamaría 1",
		direccion: "***",
		municipio: "Palacios",
		capacidad: 1000,
		ruta: new Types.ObjectId("6516371f125c13a96e347b61"),
	},
	{
		nombre: "Abel Santamaría 2",
		direccion: "***",
		municipio: "Palacios",
		capacidad: 1000,
		ruta: new Types.ObjectId("6516371f125c13a96e347b61"),
	},
	{
		nombre: "Abel Santamaría 3",
		direccion: "***",
		municipio: "Palacios",
		capacidad: 1000,
		ruta: new Types.ObjectId("6516371f125c13a96e347b61"),
	},
	{
		nombre: "La Recria",
		direccion: "****",
		municipio: "Pinar del Río",
		capacidad: 500,
		ruta: new Types.ObjectId("6516371f125c13a96e347b62"),
	},
	{
		nombre: "Ovas",
		direccion: "****",
		municipio: "Pinar del Río",
		capacidad: 1000,
		ruta: new Types.ObjectId("6516371f125c13a96e347b62"),
	},
	{
		nombre: "Vaqueria 1",
		direccion: "****",
		municipio: "Pinar del Río",
		capacidad: 1000,
		ruta: new Types.ObjectId("6516371f125c13a96e347b62"),
	},
	{
		nombre: "Vaqueria 2",
		direccion: "****",
		municipio: "Pinar del Río",
		capacidad: 1000,
		ruta: new Types.ObjectId("6516371f125c13a96e347b62"),
	},
	{
		nombre: "Vaqueria 3",
		direccion: "****",
		municipio: "Pinar del Río",
		capacidad: 1000,
		ruta: new Types.ObjectId("6516371f125c13a96e347b62"),
	},
	{
		nombre: "Agricola VueltaBajo",
		direccion: "******",
		municipio: "Consolacion del Sur",
		capacidad: 1000,
		ruta: new Types.ObjectId("6516371f125c13a96e347b5d"),
	},
	{
		nombre: "Maximo Lugo (Tirao)",
		direccion: "****",
		municipio: "San Luis",
		capacidad: 1000,
		ruta: new Types.ObjectId("6516371f125c13a96e347b5f"),
	},
	{
		nombre: "Turcios Lima( Empresa)",
		direccion: "***",
		municipio: "San Luis",
		capacidad: 1000,
		ruta: new Types.ObjectId("6516371f125c13a96e347b60"),
	},
	{
		nombre: "Malas Aguas",
		direccion: "****",
		municipio: "Las Minas",
		capacidad: 1000,
		ruta: new Types.ObjectId("6516371f125c13a96e347b5d"),
	},
	{
		nombre: "Rafael Morales (La Tea)",
		direccion: "***",
		municipio: "San Luis",
		capacidad: 1000,
		ruta: new Types.ObjectId("6516371f125c13a96e347b60"),
	},
	{
		nombre: "Jose Hernandez Leon (Km. 120)",
		direccion: "****",
		municipio: "Consolacion del Sur",
		capacidad: 1000,
		ruta: new Types.ObjectId("6516371f125c13a96e347b5d"),
	},
	{
		nombre: "En Caliente",
		direccion: "******",
		municipio: "Consolacion del Sur",
		capacidad: 0,
		ruta: new Types.ObjectId("6516371f125c13a96e347b5c"),
	},
	{
		nombre: "En Caliente",
		direccion: "******",
		municipio: "San Juan",
		capacidad: 0,
		ruta: new Types.ObjectId("6516371f125c13a96e347b5f"),
	},
	{
		nombre: "Brione",
		direccion: "****",
		municipio: "Pinar del Río",
		capacidad: 1500,
		ruta: new Types.ObjectId("6516371f125c13a96e347b62"),
	},
	{
		nombre: "Ent. Ovas",
		direccion: "****",
		municipio: "Pinar del Río",
		capacidad: 500,
		ruta: new Types.ObjectId("6516371f125c13a96e347b62"),
	},
	{
		nombre: "La Campana",
		direccion: "****",
		municipio: "Pinar del Río",
		capacidad: 1500,
		ruta: new Types.ObjectId("6516371f125c13a96e347b62"),
	},
	{
		nombre: "Cabeza",
		direccion: "****",
		municipio: "Las Minas",
		capacidad: 1000,
		ruta: new Types.ObjectId("6516371f125c13a96e347b5d"),
	},
	{
		nombre: "Pon",
		direccion: "****",
		municipio: "Las Minas",
		capacidad: 1000,
		ruta: new Types.ObjectId("6516371f125c13a96e347b5d"),
	},
	{
		nombre: "Santa Lucia",
		direccion: "****",
		municipio: "Las Minas",
		capacidad: 1000,
		ruta: new Types.ObjectId("6516371f125c13a96e347b5d"),
	},
	{
		nombre: "10 de Viñales",
		direccion: "****",
		municipio: "Viñales",
		capacidad: 1000,
		ruta: new Types.ObjectId("6516371f125c13a96e347b5d"),
	},
	{
		nombre: "Km 4 de Viñales",
		direccion: "****",
		municipio: "Viñales",
		capacidad: 1000,
		ruta: new Types.ObjectId("6516371f125c13a96e347b5d"),
	},
	{
		nombre: "Barrigonas",
		direccion: "***",
		municipio: "Consolacion del Sur",
		capacidad: 1000,
		ruta: new Types.ObjectId("6516371f125c13a96e347b60"),
	},
	{
		nombre: "Boca de Galafre",
		direccion: "****",
		municipio: "San Juan",
		capacidad: 1000,
		ruta: new Types.ObjectId("6516371f125c13a96e347b5f"),
	},
	{
		nombre: "ueb San Juan",
		direccion: "****",
		municipio: "San Juan",
		capacidad: 1000,
		ruta: new Types.ObjectId("6516371f125c13a96e347b5f"),
	},
	{
		nombre: "Lazareto",
		direccion: "****",
		municipio: "Pinar de Rio",
		capacidad: 1000,
		ruta: new Types.ObjectId("6516371f125c13a96e347b5c"),
	},
	{
		nombre: "Mariposa",
		direccion: "****",
		municipio: "Pinar de Rio",
		capacidad: 1000,
		ruta: new Types.ObjectId("6516371f125c13a96e347b5c"),
	},
	{
		nombre: "Primavera",
		direccion: "****",
		municipio: "Pinar de Rio",
		capacidad: 1000,
		ruta: new Types.ObjectId("6516371f125c13a96e347b5c"),
	},
	{
		nombre: "El Sitio",
		direccion: "****",
		municipio: "Pinar de Rio",
		capacidad: 1000,
		ruta: new Types.ObjectId("6516371f125c13a96e347b5c"),
	},
	{
		nombre: "La Caridad",
		direccion: "****",
		municipio: "Pinar de Rio",
		capacidad: 1000,
		ruta: new Types.ObjectId("6516371f125c13a96e347b5c"),
	},
	{
		nombre: "Km 13 Coloma",
		direccion: "****",
		municipio: "Pinar de Rio",
		capacidad: 1000,
		ruta: new Types.ObjectId("6516371f125c13a96e347b5c"),
	},
	{
		nombre: "Km 20 Coloma",
		direccion: "****",
		municipio: "Pinar de Rio",
		capacidad: 1000,
		ruta: new Types.ObjectId("6516371f125c13a96e347b5c"),
	},
	{
		nombre: "Pascual Marti",
		direccion: "****",
		municipio: "Pinar de Rio",
		capacidad: 1000,
		ruta: new Types.ObjectId("6516371f125c13a96e347b5e"),
	},
	{
		nombre: "10 de Octubre",
		direccion: "****",
		municipio: "Pinar de Rio",
		capacidad: 1000,
		ruta: new Types.ObjectId("6516371f125c13a96e347b5e"),
	},
	{
		nombre: "Montoto",
		direccion: "****",
		municipio: "Pinar de Rio",
		capacidad: 1000,
		ruta: new Types.ObjectId("6516371f125c13a96e347b5e"),
	},
	{
		nombre: "Caribe",
		direccion: "****",
		municipio: "Pinar de Rio",
		capacidad: 1000,
		ruta: new Types.ObjectId("6516371f125c13a96e347b5e"),
	},
	{
		nombre: "Baro 1",
		direccion: "****",
		municipio: "Pinar de Rio",
		capacidad: 1000,
		ruta: new Types.ObjectId("6516371f125c13a96e347b5e"),
	},
	{
		nombre: "Baro 4",
		direccion: "****",
		municipio: "Pinar de Rio",
		capacidad: 1000,
		ruta: new Types.ObjectId("6516371f125c13a96e347b5e"),
	},
	{
		nombre: "Baro 5",
		direccion: "****",
		municipio: "Pinar de Rio",
		capacidad: 1000,
		ruta: new Types.ObjectId("6516371f125c13a96e347b5e"),
	},
	{
		nombre: "Baro 6",
		direccion: "****",
		municipio: "Pinar de Rio",
		capacidad: 1000,
		ruta: new Types.ObjectId("6516371f125c13a96e347b5e"),
	},
	{
		nombre: "Pilotos",
		direccion: "****",
		municipio: "Consolacion del Sur",
		capacidad: 1000,
		ruta: new Types.ObjectId("6516371f125c13a96e347b5c"),
	},
	{
		nombre: "Rio Hondo",
		direccion: "****",
		municipio: "Consolacion del Sur",
		capacidad: 1000,
		ruta: new Types.ObjectId("6516371f125c13a96e347b5c"),
	},
	{
		nombre: "Puerta de Golpe",
		direccion: "****",
		municipio: "Consolacion del Sur",
		capacidad: 1000,
		ruta: new Types.ObjectId("6516371f125c13a96e347b5c"),
	},
	{
		nombre: "El Ruis",
		direccion: "****",
		municipio: "Viñales",
		capacidad: 1000,
		ruta: new Types.ObjectId("6516371f125c13a96e347b5d"),
	},
	{
		nombre: "1",
		direccion: "****",
		municipio: "Viñales",
		capacidad: 1000,
		ruta: new Types.ObjectId("6516371f125c13a96e347b5d"),
	},
	{
		nombre: "Directo Anden",
		direccion: "****",
		municipio: "Viñales",
		capacidad: 1000,
		ruta: new Types.ObjectId("6516371f125c13a96e347b60"),
	},
	{
		nombre: "Piloto",
		direccion: "****",
		municipio: "San Luis",
		capacidad: 1000,
		ruta: new Types.ObjectId("6516371f125c13a96e347b5f"),
	},
	{
		nombre: "Pito",
		direccion: "****",
		municipio: "San Luis",
		capacidad: 1000,
		ruta: new Types.ObjectId("6516371f125c13a96e347b5f"),
	},
	{
		nombre: "Simon",
		direccion: "****",
		municipio: "San Luis",
		capacidad: 1000,
		ruta: new Types.ObjectId("6516371f125c13a96e347b5f"),
	},
	{
		nombre: "Silvito",
		direccion: "****",
		municipio: "San Luis",
		capacidad: 1000,
		ruta: new Types.ObjectId("6516371f125c13a96e347b5f"),
	},
];

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
		const data: Tank = req.body;
		const newTank = new TankModel({ ...data });
		const result = await newTank.save();
		const tankWithDetails = await result.populate("routes");

		return handleResponse({
			data: { tank: tankWithDetails },
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
		const id = new Types.ObjectId(req.params.id);
		const data = req.body;

		const query = TankModel.findByIdAndUpdate(id, { ...data }, { new: true });
		const tankWithDetails = await query.populate("routes");

		return handleResponse({
			data: { tank: tankWithDetails },
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
