// import { Request, Response } from "express";
// import FormData from "form-data";
// import axios from "axios";
// import recipesModel from "./recipes.model";

// export const addProduct = async (req: Request, res: Response) => {
//   try {
//     const file = req.file as Express.Multer.File;

//     if (!file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     // Imgbb upload
//     const formData = new FormData();
//     formData.append("image", file.buffer.toString("base64"));

//     const apiKey = process.env.IMGBB_API_KEY;

//     const imgbbRes = await axios.post(
//       `https://api.imgbb.com/1/upload?key=${apiKey}`,
//       formData,
//       {
//         headers: formData.getHeaders(),
//       }
//     );

//     const imageUrl = imgbbRes.data.data.url;

//     // Database save
//     const product = await recipesModel.create({
//       title: req.body.title,
//       category: req.body.category,
//       nutrition: req.body.nutrition,
//       ingredients: req.body.ingredients,
//       steps: req.body.steps,
//       description: req.body.description,
//       image: imageUrl,
//     });

//     res.status(201).json({
//       success: true,
//       message: "Product added successfully",
//       product,
//     });
//   } catch (error: any) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: error.message || "Upload failed",
//     });
//   }
// };