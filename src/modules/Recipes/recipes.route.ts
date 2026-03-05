import { Router } from "express";
import { createProduct, deleteProduct, getProducts } from "./recipes.controller";


const router = Router();

router.post("/", createProduct);
router.get("/", getProducts);
router.delete("/:id", deleteProduct);

export default router;