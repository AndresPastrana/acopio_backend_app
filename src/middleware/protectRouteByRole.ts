import { NextFunction, Request, Response } from "express";
import { Payload, Role } from "../types.d.js";
import { handleResponse } from "./index.js";
//Asumimios que ya tenemos un usuario atenticado con un token valido, el user es agregado a la request

export const protectRouteByRole = (hasRoles: Role[] | string[]) => {
  return (
    req: Request & {
      user?: Payload;
    },
    res: Response,
    next: NextFunction
  ) => {
    // TODO: Verify that hasRoles is or has valdis roles

    if (req.user) {
      if (hasRoles.includes(req.user.role)) {
        return next();
      }
    }

    return handleResponse({
      res,
      statusCode: 401,
      msg: "Unauthorized",
      error: true,
    });
  };
};
