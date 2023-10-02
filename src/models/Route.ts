import { model, Schema } from "mongoose";
import { Route } from "../types.js";

const routeSchema = new Schema<Route>({
	name: { type: String, required: true, unique: true },
});

routeSchema.methods.toJSON = function (this) {
	const { __v, ...rest } = this.toObject();
	return rest;
};
// Create the Route model
export const RouteModel = model<Route>("Route", routeSchema);
