import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    servings: String,
    time: String,
    nutrition: String,
    ingredients: { type: [String], required: true }, // array of strings
    steps: { type: [String], required: true },  
    description: String,
    image: String,
    price: { type: Number, required: false }, // <-- price added
  },
  { timestamps: true }
);

export default mongoose.model("Recipe", recipeSchema);