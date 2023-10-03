// TODO: Depeniendo del tipo de error cambiar el status de la respuesta
// Validation error 404
// Databse Error  500
// No autorizado 401

import { Response } from "express";

// No endpoint 403
type HandleResponse = {
	// rome-ignore lint/suspicious/noExplicitAny: <explanation>
	error?: any;
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
	const customMessage = msg ? msg : defaultMsg;
	if (!error) {
		return res
			.json({
				msg: customMessage,
				data,
			})
			.status(statusCode);
	} else {
		// Send a custom message depending on the error type
		return res.status(statusCode).json({
			msg: customMessage,
			error,
		});
	}
};
