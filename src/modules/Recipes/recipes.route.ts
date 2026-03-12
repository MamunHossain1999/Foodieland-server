import express from "express";
import multer from "multer";
import {
  getAllRecipes,
  getRecipeDetails,

  deleteRecipe,
  updateRecipe
} from "../../modules/Recipes/recipes.controller";
import { adminMiddleware } from "../../middleware/admin.middleware";


const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage });

// CRUD routes
router.get("/all/recipes", getAllRecipes);
router.get("/recipe/:id", getRecipeDetails);
router.put("/update/:id",upload.single("image"),adminMiddleware, updateRecipe);
router.delete("/delete/:id",adminMiddleware, deleteRecipe);


const recipesRoutes = router;
export default recipesRoutes;