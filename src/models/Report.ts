import { Document, HydratedDocument, model, Schema } from "mongoose";
import { MilkType, Report } from "../types.d.js";

const ReportSchema = new Schema<Report>(
  {
    dayli_collect: {
      type: Number,
      required: true,
      maxlength: 6,
    },
    producer: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Producer",
    },
    productive_base: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "ProductiveBase",
    },
    type_milk: {
      type: String,
      enum: [MilkType.hot, MilkType.cold],
      required: true,
    },
  },
  {
    timestamps: true,

    methods: {
      toJSON: function (this: HydratedDocument<Report & Document>) {
        const { __v, _id, ...rest } = this.toObject();
        return { id: _id, ...rest };
      },
    },
  }
);

export const ReportModel = model<Report>("Report", ReportSchema);
