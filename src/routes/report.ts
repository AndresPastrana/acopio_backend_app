import { Request, Response, Router } from "express";
import { body, matchedData, param, query } from "express-validator";
import { Types, isValidObjectId } from 'mongoose';
import {
	handleResponse,
	isValidDoc,
	isValidToken,
	protectRouteByRole,
	validateRequest,
} from "../middleware/index.js";
import { MilkType, Role } from "../types.d.js";
import { ReportController } from "./../controllers/index.js";
import { ProducerModel, ReportModel } from "./../models/index.js";
export const router = Router();
// POST /report
router.post(
	"/",
	[
		isValidToken,
		protectRouteByRole([Role.Specialist]),
		body("dayli_collect", "Invalid dayli collect").isInt(),
		body("type_milk", "Invalid type of milk").isIn([
			MilkType.cold,
			MilkType.hot,
		]),
		body("dayli_collect", "Invalid dayli collect").isInt(),
		body("producer", "Invalid producer")
			.exists({ values: "null" })
			.custom(async (producer) => {
				await isValidDoc(producer, ProducerModel, false);
				return true;
			}),
		validateRequest,
	],
	ReportController.createReport,
);

// GET /report?producer=3743vn3hcc3n3c53

router.get(
	"/",
	[
		isValidToken,
		protectRouteByRole([Role.Specialist]),
		query("producer", "Invalid producer")
			.exists({ values: "null" })
			.custom(async (producer) => {
				await isValidDoc(producer, ProducerModel, false);
				return true;
			}),
	],
	ReportController.getAllReportsByProducer,
);

router.get('by-productive-base/:id',[
	isValidToken,
	protectRouteByRole([Role.Specialist]),
	param('id')
	.isMongoId()
    .withMessage('Productive base ID must be a valid ObjectId')
	.if((id)=>isValidObjectId(id))
	.custom(async(id)=>await isValidDoc(id)) 
	.withMessage('Productive base ID is invalid')
	.customSanitizer((id)=> new Types.ObjectId(id))
	,validateRequest
], async(req:Request,res:Response)=>{
try {
	
	const {id} = matchedData(req,{locations:['params']})
	const reports = await ReportModel.find({ productive_base: id });

    if (!reports || reports.length === 0) {
      return  handleResponse({
		res,
		statusCode:404,
		msg:"No reports found for the specified productive_base. ",
		error: new Error("No reports found")
	  })
    }
	return handleResponse({
		res,
		data: reports,
		statusCode: 200
	})

} catch (error) {
	return  handleResponse({
		res,
		statusCode:500,
		msg:"Contact the backend admin ",
		error: new Error("Internal server error")
	  })
}
})
