import { Schema, model } from "mongoose";

const orderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  recipeId: { type: Schema.Types.ObjectId, ref: "Recipe", required: true },
  status: { type: String, enum: ["Pending", "Delivered", "Cancelled"], default: "Pending" },
}, { timestamps: true });

export const OrderModel = model("Order", orderSchema);