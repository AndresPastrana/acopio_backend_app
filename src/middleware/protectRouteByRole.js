//Asumimios que ya tenemos un usuario atenticado con un token valido, el user es agregado a la request

import { Role } from "../types.d.js";
import { handleResponse } from "./handleResponse.js";

export const protectRouteByRole = (req, res, next, requiredRole) => {
	if (requiredRole === Role.Admin || requiredRole === Role.Specialist) {
		const { role } = req.user;
		return role !== requiredRole
			? handleResponse({ res, statusCode: 401, error: "Unauthorized" })
			: next();
	}
	//  TODO: Invalid role
};
