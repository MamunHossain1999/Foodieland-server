import jwt from "jsonwebtoken";
import { IUserPayload } from "../modules/auth/auth.interface";


export const generateToken = (payload: IUserPayload) => {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "7d" });
};
