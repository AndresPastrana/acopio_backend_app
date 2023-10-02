import { model, Schema } from "mongoose";

import { State } from "../types.js";
const StateSchema = new Schema<State>({
	name: {
		type: String,
		unique: true,
		required: true,
	},
	province: {
		type: Schema.Types.ObjectId,
		ref: "Province",
		required: true,
	},
});

export const StateModel = model<State>("State", StateSchema);
