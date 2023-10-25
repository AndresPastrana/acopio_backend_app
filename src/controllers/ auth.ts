import { Request, Response } from "express";
import { matchedData } from "express-validator";
import { Types } from "mongoose";
import { createJWTAsync } from "../helpers/jwt.js";
import { UserModel } from "../models/index.js";
import { hashString } from "./../helpers/index.js";
import { handleResponse } from "./../middleware/index.js";
import { Payload, Role } from "./../types.d.js";
//  /auth?role=specialist
const register = async (req: Request, res: Response) => {
  try {
    const {
      username,
      password,
      firstname,
      surename,
      secondname = "",
      second_surename = "",
      productiveBaseInCharge = null,
    } = matchedData(req, { locations: ["body"] });
    const { role } = req.query;
    const hashedPassword: string = await hashString(password);

    const newUser = new UserModel({
      username,
      password: hashedPassword,
      role,
      firstname,
      surename,
    });
    if (role === Role.Specialist) {
      if (!productiveBaseInCharge)
        return res.json({ error: "Productive base requireda" });
      //  TODO: fix this tipo error in types.ts
      newUser.productiveBaseInCharge = new Types.ObjectId(
        productiveBaseInCharge
      );
    }

    if (secondname) {
      newUser.secondname = secondname;
    }
    if (second_surename) {
      newUser.second_surename = second_surename;
    }

    const result = await newUser.save();
    const populated = await result.populate('productiveBaseInCharge')


    return handleResponse({
      statusCode: 201,
      data: populated,
      res,
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({ error });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { username = "", password = "" } = req.body;
    const query = UserModel.find({ username });
    const result = await query.exec();

    // TODO: validate no results in query
    if (result.length === 0) {
      return res.json({ msg: "Invalid use name or password" });
    }

    const user = result[0];

    // TODO: Validate Wrong password
    const isValidPassword = await user.validatePassword(password);

    if (isValidPassword) {
      // TODO: Generate token
      const payload:Payload = {
        uid: user._id.toString(),
        role: user.role,
      };

      // si es un specialista agrero la base productiva a cargo al payload
      if(user.role ===Role.Specialist){
        payload.productiveBaseInCharge = user.productiveBaseInCharge.toString() ?? null
      }
      const token = await createJWTAsync(payload)
      
      return handleResponse({
        data: {
          access_token: token,
        },
        statusCode: 200,
        res,
      });
    }
    return handleResponse({
      res,
      statusCode: 404,
      msg: "Invalid username or password",
    });
  } catch (error) {
    return res.json({ error });
  }
};
// /auth?role=admin&id=sdfsdfsfsdfsdfsdf
// If id is not passed return al the role users

//
const getUser = async (req: Request, res: Response) => {
  const { role, id } = req.query;
  const filter =
    id !== "all" ? { _id: new Types.ObjectId(id as string), role } : { role };

  const query = UserModel.find(filter);

  // Si es especialista get the info the la base productiva
  if (role === Role.Specialist) {
    query.populate("productiveBaseInCharge");
  }

  const result = await query.exec();

  return handleResponse({
    res,
    data: result,
    statusCode: 200,
    error: false,
  });
};

const edituser = async (req: Request, res: Response) => {
  const { role, id } = req.query;

  try {
    if (role === Role.Specialist) {
      const { _id = null, role = null, password = null, ...data } = req.body;
      const hashedPassword =
        (password && (await hashString(password))) || password;

      const newData = password
        ? { ...data, password: hashedPassword }
        : { ...data };

      const updatedUser = await UserModel.findByIdAndUpdate(
        new Types.ObjectId(id as string),
        {
          ...newData,
        },
        { new: true }
      );
      const populated = await updatedUser?.populate('productiveBaseInCharge')

      return handleResponse({
        res,
        data: populated,
        statusCode: 201,
      });
    }
    return handleResponse({
      res,
      statusCode: 400,
      msg: "You dont have permission to edit this user",
    });
  } catch (error) {
    return handleResponse({
      res,
      error,
      statusCode: 500,
    });
  }
};

const deletetUser = async (req: Request, res: Response) => {
  try {
    const { role = "", id = "" } = req.query;
    const filter = { role };
    const query = UserModel.findByIdAndDelete(
      new Types.ObjectId(id as string),
      filter
    );
    const result = await query.exec();
    return handleResponse({
      res,
      statusCode: 200,
      data:result,
    });
  } catch (error) {
    return handleResponse({
      res,
      statusCode: 500,
      error,
    });
  }
};

export const AuthController = {
  register,
  getUser,
  login,
  edituser,
  deletetUser,
};
