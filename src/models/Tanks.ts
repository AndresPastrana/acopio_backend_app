import { Document, HydratedDocument, ObjectId, Schema, model } from "mongoose";
import { Tank } from "../types.js";

const TanksSchema = new Schema<Tank>({
	address: {
		type: String,
		required: true,
	},
	capacity: {
		type: Number,
		required: true,
		default: 0,
	},
	name: {
		type: String,
		required: true,
		unique: true,
	},
	routes: {
		type: [Schema.Types.ObjectId],
		ref: "Route",
		required: false,
		default: [],
	},
	state: {
		type: Schema.Types.ObjectId,
		ref: "State",
		required: true,
	},
},
{
	methods: {
		toJSON: function (this: HydratedDocument<Tank &Document>) {
			const { __v, _id, ...rest } = this.toObject();
			return { id: _id, ...rest };
		},
	},
},);

TanksSchema.methods.existRoute = function (
	routeToVerify: string,
	currentDocID: ObjectId,
): Boolean {
	console.log(this.toObject());
	//  Exclude the self doc for the search
	if (this.toObject()._id.toString() === currentDocID.toString()) return false;

	const arrayOfRoutes = this.toObject().routes.map((oid: ObjectId) =>
		oid.toString(),
	);
	return arrayOfRoutes.includes(routeToVerify);
};

export const TankModel = model<Tank>("Tank", TanksSchema);
