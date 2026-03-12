import { Types } from "mongoose";

export interface ILike {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  recipeId: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}