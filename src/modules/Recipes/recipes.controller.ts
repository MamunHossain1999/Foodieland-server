import { Request, Response } from "express";
import { Product } from "./recipes.model";


// Create Product
export const createProduct = async (req: Request, res: Response) => {
  const result = await Product.create(req.body);
  res.status(201).json(result);
};

// Get All Products
export const getProducts = async (req: Request, res: Response) => {
  const result = await Product.find().populate("category");
  res.json(result);
};


// Delete Product
export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await Product.findByIdAndDelete(id);

  res.json({
    message: "Product deleted successfully",
    result,
  })}