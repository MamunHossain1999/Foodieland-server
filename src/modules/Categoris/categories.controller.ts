import { Request, Response } from "express";
import { Category } from "./categories.model";
import { Product } from "../Recipes/recipes.model";


// Create Category
export const createCategory = async (req: Request, res: Response) => {
  const result = await Category.create(req.body);
  res.status(201).json(result);
};

// Get All Categories
export const getCategories = async (req: Request, res: Response) => {
  const result = await Category.find();
  res.json(result);
};

// Category Details + Products
export const getCategoryDetails = async (req: Request, res: Response) => {
  const { id } = req.params;

  const category = await Category.findById(id);
  const products = await Product.find({ category: id });

  res.json({
    category,
    products,
  });
};

// Delete Category
export const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params;

  await Product.deleteMany({ category: id });

  const result = await Category.findByIdAndDelete(id);

  res.json({
    message: "Category deleted successfully",
    result,
  });
};