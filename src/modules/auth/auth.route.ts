import { Router } from "express";
import * as authController from "./auth.controller";
import { validate } from "../../middleware/validation.middleware";
import { protect } from "../../middleware/auth.middleware";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  updateProfileSchema,
  verifyOtpSchema,
  resendOtpSchema,
} from "./auth.validation";

const router = Router();

// Auth routes
router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/logout", authController.logout);

// Password reset & OTP
router.post("/forgot-password", validate(forgotPasswordSchema), authController.forgotPassword);
router.put("/reset-password", validate(resetPasswordSchema), authController.resetPassword);

// OTP verification
router.post("/verify-otp", validate(verifyOtpSchema), authController.verifyOtp);
router.post("/resend-otp", validate(resendOtpSchema), authController.resendOtp);

// User profile
router.put("/update-profile", protect, validate(updateProfileSchema), authController.updateProfile);
router.get("/profile", protect, authController.getProfile);
router.get("/users", protect, authController.getUsers);

// update user role (admin only)
router.put("/user/:id/role", protect, authController.updateUserRole);
router.delete("/user/:id", protect, authController.deleteUser);

export default router;