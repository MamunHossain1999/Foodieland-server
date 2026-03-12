import mongoose, { Schema, Document } from "mongoose";
import { ILike } from "./like.interface";

const LikeSchema = new Schema<ILike>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    recipeId: { type: Schema.Types.ObjectId, ref: "Recipe", required: true },
  },
  { timestamps: true }
);

export const LikeModel = mongoose.model<ILike>("Like", LikeSchema);