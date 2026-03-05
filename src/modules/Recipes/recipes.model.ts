import { Schema, model } from "mongoose";
import { IProduct } from "./recipes.interface";


const productSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  time: { type: String, required: true },
  servings: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
});

export const Product = model<IProduct>("Product", productSchema);