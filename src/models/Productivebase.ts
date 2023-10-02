import { Document, HydratedDocument, model, Schema } from "mongoose";
import { ProductiveBase } from "../types.js";
const ProductiveBaseSchema = new Schema<ProductiveBase>({
	address: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
		unique: true,
	},
	route: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: "Route",
	},
	state: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: "State",
	},
});

ProductiveBaseSchema.methods.toJSON = function (
	this: HydratedDocument<ProductiveBase & Document>,
) {
	const { __v, ...rest } = this.toObject();
	return rest;
};

export const ProductiveBaseModel = model<ProductiveBase>(
	"ProductiveBase",
	ProductiveBaseSchema,
);
