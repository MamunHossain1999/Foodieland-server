import { z } from "zod";

// Register Validation
export const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["user", "admin"]).optional()
});

// Login Validation
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6)
});

// Forgot Password Validation
export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address")
});

// Reset Password Validation
export const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters")
});

// Update Profile Validation
export const updateProfileSchema = z.object({
  name: z.string().min(3).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional()
});
