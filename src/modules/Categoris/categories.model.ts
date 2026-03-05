import { Schema, model } from "mongoose";
import { ICategory } from "./categories.interface";


const categorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
  icon: { type: String, required: true },
});

export const Category = model<ICategory>("Category", categorySchema);