import { Request, Response } from "express";
import { LikeModel } from "./like.model";
import connectDB from "../../config/db";

// ==================== TOGGLE LIKE ====================
export const toggleLike = async (req: Request, res: Response) => {
  try {
    await connectDB(); // Ensure DB connection before querying
    const { recipeId } = req.body as { recipeId: string };
    const userId = req.user.id;

    if (!recipeId) {
      return res.status(400).json({ message: "recipeId is required" });
    }

    const existingLike = await LikeModel.findOne({ userId, recipeId });

    if (existingLike) {
      await LikeModel.deleteOne({ _id: existingLike._id });
      return res.status(200).json({ liked: false, message: "Unliked" });
    }

    await LikeModel.create({ userId, recipeId });
    return res.status(201).json({ liked: true, message: "Liked" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ==================== GET LIKE COUNT ====================
export const getLikeCount = async (req: Request, res: Response) => {
  try {
    await connectDB(); // Ensure DB connection before querying
    const { recipeId } = req.params;

    if (!recipeId) {
      return res.status(400).json({ message: "recipeId is required" });
    }

    const count = await LikeModel.countDocuments({ recipeId });

    return res.status(200).json({ count });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ==================== CHECK IF USER ALREADY LIKED ====================
export const checkUserLiked = async (req: Request, res: Response) => {
  try {
    await connectDB(); // Ensure DB connection before querying
    const { recipeId } = req.params;
    const userId = req.user.id;

    const liked = await LikeModel.exists({ recipeId, userId });

    return res.status(200).json({ liked: !!liked });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};