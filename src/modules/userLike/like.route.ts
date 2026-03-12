import express from "express";

import { toggleLike, getLikeCount, checkUserLiked } from "./like.controller";
import { protect } from "../../middleware/auth.middleware";


const router = express.Router();

// Toggle like/unlike
router.post("/like", protect, toggleLike);

// Get total likes for a recipe
router.get("/recipes/:recipeId/likes", getLikeCount);

// Check if current user liked this recipe
router.get("/recipes/:recipeId/liked", protect, checkUserLiked);

const likeRoutes = router;
export default likeRoutes;  