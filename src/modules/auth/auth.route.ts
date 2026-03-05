import { Router } from "express";
import * as authController from "./auth.controller";
import { validate } from "../../middleware/validation.middleware";
import { protect } from "../../middleware/auth.middleware";
import { forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema, updateProfileSchema } from "./auth.validation";


const router = Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/logout", authController.logout);
router.post("/forgot-password", validate(forgotPasswordSchema), authController.forgotPassword);
router.put("/reset-password/:token", validate(resetPasswordSchema), authController.resetPassword);
router.put("/update-profile", protect, validate(updateProfileSchema), authController.updateProfile);
router.get("/profile", protect, authController.getProfile);

export default router;
