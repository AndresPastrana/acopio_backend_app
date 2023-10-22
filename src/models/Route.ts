import { Document, HydratedDocument, model, Schema } from "mongoose";
import { Route } from "../types.js";

const routeSchema = new Schema<Route>({
	name: { type: String, required: true, unique: true },
},
{
	methods: {
		toJSON: function (this: HydratedDocument<Route & Document>) {
			const { __v, _id, ...rest } = this.toObject();
			return { id: _id, ...rest };
		},
	},
});


// Create the Route model
export const RouteModel = model<Route>("Route", routeSchema);
