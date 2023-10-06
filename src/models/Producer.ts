import { model, Schema } from "mongoose";
import { enumMonth, monthsContractsDefault } from "../const.js";
import { validateCi } from "../helpers/index.js";
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
		validate: {
			validator: function (value: string) {
				return validateCi(value);
			},
			message: "Invalid CI format. CI should match the format: YYYYMMDDXXXXX",
		},
	},
	firstname: {
		type: String,
		required: true,
	},
	secondname: {
		type: String,
		required: false,
	},
	surename: { type: String, required: true },
	second_surename: { type: String, required: false },
	age: {
		type: Number,
		required: true,
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
