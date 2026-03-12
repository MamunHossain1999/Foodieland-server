import { Request, Response } from "express";
import { OrderModel } from "./order.model";

// ====================== CREATE ORDER ======================
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { recipeId } = req.body as { recipeId: string };
    const userId = req.user.id;

    if (!recipeId) {
      return res.status(400).json({ message: "recipeId is required" });
    }

    // Optional: prevent duplicate order for same recipe
    const existingOrder = await OrderModel.findOne({ userId, recipeId });
    if (existingOrder) {
      return res.status(400).json({ message: "You already ordered this recipe" });
    }

    const order = await OrderModel.create({ userId, recipeId });

    return res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ====================== GET USER ORDER HISTORY ======================
export const getOrderHistory = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const orders = await OrderModel.find({ userId })
      .populate("recipeId") // include recipe details
      .populate("userId", "name email") // include user details (optional)
      .sort({ createdAt: -1 });

    return res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ====================== DELETE ORDER ======================
export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await OrderModel.findOne({ _id: orderId, userId });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await OrderModel.deleteOne({ _id: orderId });

    return res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ====================== GET SINGLE ORDER (OPTIONAL) ======================
export const getSingleOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await OrderModel.findOne({ _id: orderId, userId }).populate("recipeId");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json(order);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body as { status: "Pending" | "Delivered" | "Cancelled" };

    const order = await OrderModel.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    return res.status(200).json({ message: "Order status updated", order });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};