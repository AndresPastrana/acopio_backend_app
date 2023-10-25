import { Document, HydratedDocument, model, Schema } from "mongoose";
import { compareHash } from "../helpers/index.js";
import { Role, User } from "../types.d.js";
const UserSchema = new Schema<User>({
	username: {
		type: String,
		required: true,
		unique: true,
		maxlength: 50,
	},
	password: {
		type: String,
		required: true,
	},
	role: {
		type: String,
		enum: [Role.Specialist, Role.Admin],
		required: true,
	},
	firstname: {
		type: String,
		required: true,
	},
	secondname: {
		type: String,
		required: false,
		default: "",	
	},
	surename: {
		type: String,
		required: true,
	},
	second_surename: {
		type: String,
		default: "",
		required: false,
	},
	productiveBaseInCharge: {
		type: Schema.Types.ObjectId,
		required: false,
		default: null,
		ref: "ProductiveBase",
	},
},{
	methods: {
		toJSON: function (this: HydratedDocument<User &Document>) {
			const { __v, _id,password, ...rest } = this.toObject();
			return { id: _id, ...rest };
		},
		validatePassword: async function (input_password: string) {
			const { password } = this.toObject();
			const same = await compareHash(input_password, password);
			return same;
		}
	},
});


// UserSchema.methods.toJSON = function () {
// 	const { __v, , ...rest } = this.toObject();
// 	return rest;
// };

export const UserModel = model<User>("User", UserSchema);
