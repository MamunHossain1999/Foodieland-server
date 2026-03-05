import mongoose from "mongoose";

export interface IProduct {
  name: string;
  time: string;
  servings: string;
  price: number;
  image: string;
  description: string;
  category: mongoose.Types.ObjectId;
}