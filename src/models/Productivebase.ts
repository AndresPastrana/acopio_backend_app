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
},{
	methods: {
		toJSON: function (this: HydratedDocument<ProductiveBase & Document>) {
			const { __v, _id,...rest } = this.toObject();
			return { id: _id, ...rest };
		},
	},
});



export const ProductiveBaseModel = model<ProductiveBase>(
	"ProductiveBase",
	ProductiveBaseSchema,
);
