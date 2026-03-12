import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import dotenv from "dotenv";
import authRoutes from "./modules/auth/auth.route";
import multer from "multer";
import axios from "axios";
import FormData from "form-data";
import { User } from "./modules/auth/auth.model";
import { protect } from "./middleware/auth.middleware";
import recipesRoutes from "./modules/Recipes/recipes.route";
import recipesModel from "./modules/Recipes/recipes.model";
import orderRoutes from "./modules/recepiOrder/order.route";
import likeRoutes from "./modules/userLike/like.route";



dotenv.config();
const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
const upload = multer();

app.use("/api/auth", authRoutes);
app.use("/api", recipesRoutes);
app.use("/api", orderRoutes);
app.use("/api", likeRoutes);
// Serve uploaded images

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Profile picture upload
app.post(
  "/api/auth/upload-avatar",
  protect,
  upload.single("avatar"),
  async (req: any, res) => {
    try {
      if (!req.file)
        return res.status(400).json({ message: "No file uploaded" });

      const formData = new FormData();
      formData.append("image", req.file.buffer.toString("base64"));

      const apiKey = process.env.IMGBB_API_KEY;

      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        formData,
        { headers: formData.getHeaders() }
      );

      const imageUrl = response.data.data.url;

      // Save to DB
      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        { avatar: imageUrl },
        { new: true }
      );

      res.json({
        imageUrl,
        message: "Profile picture uploaded successfully!",
        user: updatedUser,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Upload failed" });
    }
  }
);
// POST /api/products/upload-image
app.post(
  "/api/products/add",
  protect,
  upload.single("image"),
  async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Imgbb upload
      const formData = new FormData();
      formData.append("image", req.file.buffer.toString("base64"));
      const apiKey = process.env.IMGBB_API_KEY;

      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        formData,
        { headers: formData.getHeaders() }
      );

      const imageUrl = response.data.data.url;

      // Ingredients & steps: array support
      const ingredients = Array.isArray(req.body.ingredients)
        ? req.body.ingredients
        : [req.body.ingredients];
      const steps = Array.isArray(req.body.steps)
        ? req.body.steps
        : [req.body.steps];

      // Product save with price
      const product = await recipesModel.create({
        title: req.body.title,
        category: req.body.category,
        servings: req.body.servings || "",
        time: req.body.time || "",
        nutrition: req.body.nutrition || "",
        ingredients,
        steps,
        description: req.body.description || "",
        image: imageUrl,
        price: req.body.price || 0, // <-- price added
      });

      res.status(201).json({
        success: true,
        message: "Product added successfully",
        product,
      });
    } catch (error: any) {
      console.error("UPLOAD ERROR:", error.response?.data || error.message);

      res.status(500).json({
        success: false,
        message: error.response?.data?.message || error.message,
      });
    }
  }
);

// Serve uploaded images
app.put(
  "/api/products/:id/update-image",
  protect,
  upload.single("image"),
  async (req: any, res) => {
    try {
      const recipeId = req.params.id;
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Upload to Imgbb
      const formData = new FormData();
      formData.append("image", req.file.buffer.toString("base64"));
      const apiKey = process.env.IMGBB_API_KEY;

      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        formData,
        { headers: formData.getHeaders() }
      );

      const imageUrl = response.data.data.url;

      // Update only image field
      const updatedRecipe = await recipesModel.findByIdAndUpdate(
        recipeId,
        { image: imageUrl },
        { new: true } // return updated doc
      );

      if (!updatedRecipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }

      res.status(200).json({
        success: true,
        message: "Image updated successfully",
        recipe: updatedRecipe,
      });
    } catch (error: any) {
      console.error("IMAGE UPDATE ERROR:", error.response?.data || error.message);

      res.status(500).json({
        success: false,
        message: error.response?.data?.message || error.message,
      });
    }
  }
);
export default app;
