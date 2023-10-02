import { model, Schema } from "mongoose";
import { Province } from "../types.js";
const ProvinceSchema = new Schema<Province>(
	{
		name: {
			type: String,
			required: true,
		},
	},
	{ versionKey: false },
);
ProvinceSchema.methods.toJSON = function (this) {
	const { __v, ...rest } = this.toObject();
	return rest;
};
export const ProvinceModel = model<Province>("Province", ProvinceSchema);
