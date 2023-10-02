// TODO: Depeniendo del tipo de error cambiar el status de la respuesta
// Validation error 404
// Databse Error  500
// No autorizado 401

import { Response } from "express";

// No endpoint 403
type HandleResponse = {
	error?: Error;
	data?: Object;
	msg?: string;
	res: Response;
	statusCode: number;
};

export const handleResponse = (handleResponse: HandleResponse) => {
	const {
		error = null,
		msg = null,
		res,
		data = null,
		statusCode,
	} = handleResponse;
	const defaultMsg = error ? "Failure" : "Success";
	if (!error) {
		return res
			.json({
				msg: msg ? msg : defaultMsg,
				data,
			})
			.status(statusCode);
	} else {
		// Send a custom message depending on the error type
		return res
			.json({
				msg: "Faliure",
				error,
			})
			.status(statusCode);
	}
};
