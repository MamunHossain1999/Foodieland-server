import { Types } from "mongoose";

export interface IOrder {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  recipeId: Types.ObjectId;
  status: "Pending" | "Delivered" | "Cancelled";
  createdAt?: Date;
  updatedAt?: Date;
}