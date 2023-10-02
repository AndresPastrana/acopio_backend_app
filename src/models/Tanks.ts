import { model, Schema } from "mongoose";
import { Tank } from "../types.js";

const TanksSchema = new Schema<Tank>({
	address: {
		type: String,
		required: true,
	},
	capacity: {},
	name: {
		type: String,
		required: true,
		unique: true,
	},
	route: {
		type: Schema.Types.ObjectId,
		ref: "Route",
		required: true,
	},
	state: {
		type: Schema.Types.ObjectId,
		ref: "State",
		required: true,
	},
});

export const TankModel = model<Tank>("Tank", TanksSchema);
