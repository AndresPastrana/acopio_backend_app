import { model, Schema } from "mongoose";
import { enumMonth, monthsContractsDefault } from "../const.js";
import { MonthContract, Producer } from "../types.js";

const MonthContractSchema = new Schema<MonthContract>({
	cant: {
		type: Number,
		required: false,
		default: 0,
	},
	month: {
		type: String,
		enum: enumMonth,
	},
});
const Producerchema = new Schema<Producer>({
	productive_base: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: "ProductiveBase",
	},
	ci: {
		type: String,
		maxlength: 11,
		// validate: {
		// 	validator: function (v: string) {
		// 		return /\d{3}-\d{3}-\d{4}/.test(v);
		// 	},
		// 	message: (props) => `${props.value} not a valid ci!`,
		// },
	},
	name: {
		type: String,
		maxlength: 80,
		unique: true,
		required: true,
		lowercase: true,
		minlength: 10,
		trim: true,
	},
	cant_animals: {
		type: Number,
		required: false,
		default: 0,
	},
	months_contracts: {
		type: [MonthContractSchema],
		required: false,
		default: monthsContractsDefault,
	},
});

export const ProducerModel = model<Producer>("Producer", Producerchema);
