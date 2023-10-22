import { Document, HydratedDocument, model, Schema } from "mongoose";

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
},
{
	methods: {
		toJSON: function (this: HydratedDocument<State &Document>) {
			const { __v, _id, ...rest } = this.toObject();
			return { id: _id, ...rest };
		},
	},
},
);

export const StateModel = model<State>("State", StateSchema);
