import { Request, Response } from "express";
import recipesModel from "./recipes.model";



// Get All Recipes
export const getAllRecipes = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;  // default page 1
    const limit = parseInt(req.query.limit as string) || 8; // default 8 per page
    const skip = (page - 1) * limit;

    const total = await recipesModel.countDocuments();
    const recipes = await recipesModel.find().skip(skip).limit(limit);

    res.status(200).json({
      success: true,
      page,
      totalPages: Math.ceil(total / limit),
      totalRecipes: total,
      recipes,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// Get Recipe Details by ID
export const getRecipeDetails = async (req: Request, res: Response) => {
  try {
    const recipe = await recipesModel.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.status(200).json({ success: true, recipe });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Update Recipe
export const updateRecipe = async (req: Request, res: Response) => {
  try {
    const { title, category, nutrition, ingredients, steps, description, price } = req.body;
    const image = req.file?.filename;

    const recipe = await recipesModel.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    recipe.title = title || recipe.title;
    recipe.category = category || recipe.category;
    recipe.nutrition = nutrition || recipe.nutrition;
    recipe.ingredients = ingredients || recipe.ingredients;
    recipe.steps = steps || recipe.steps;
    recipe.description = description || recipe.description;
    if (price !== undefined) recipe.price = price; // Price update
    if (image) recipe.image = image; // Optional: only if new image uploaded

    await recipe.save();

    res.status(200).json({ success: true, recipe });

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Recipe
export const deleteRecipe = async (req: Request, res: Response) => {
  try {
    const recipe = await recipesModel.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

     await recipesModel.deleteOne({ _id: req.params.id });
    res.status(200).json({ success: true, message: "Recipe deleted successfully" });

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};