import express from "express";

import { createOrder, getOrderHistory, deleteOrder, getSingleOrder, updateOrderStatus } from "./order.controller";
import { protect} from "../../middleware/auth.middleware";
import { adminMiddleware } from "../../middleware/admin.middleware";

const router = express.Router();

// Create new order
router.post("/order", protect, createOrder);

// Get all orders of logged-in user
router.get("/orders/history", protect, getOrderHistory);

// Delete an order by ID
router.delete("/orders/:orderId", protect ,adminMiddleware, deleteOrder);

// Get single order by ID (optional)
router.get("/orders/:orderId", protect, getSingleOrder);

// Update order status (admin only)
router.patch("/orders/:orderId/status",protect, adminMiddleware, updateOrderStatus);

const orderRoutes = router;
export default orderRoutes;