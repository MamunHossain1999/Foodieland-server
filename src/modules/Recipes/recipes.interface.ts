import mongoose from "mongoose";

// Interface for Recipe document
export interface IRecipe extends Document {
  title: string;
  category: mongoose.Types.ObjectId | string; // category reference
  nutrition?: string;
  ingredients?: string;
  steps?: string;
  description?: string;
  image?: string;
  price?: number; // Price added as optional
  createdAt: Date;
  updatedAt: Date;
}