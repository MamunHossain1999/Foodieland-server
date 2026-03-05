import { Schema, model } from "mongoose";
import { IUser } from "./auth.interface";


const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
}, { timestamps: true });

export const User = model<IUser>("User", userSchema);
