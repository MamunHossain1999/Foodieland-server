
import { Request, Response } from "express";
import * as authService from "./auth.service";
import { User } from "./auth.model";

export const register = async (req: Request, res: Response) => {
  try {
    const { user, token } = await authService.registerUser(req.body);

    res.cookie("token", token, { httpOnly: true });

    res.status(201).json({
      message: "User registered. OTP sent to email",
      user,
    });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { user, token } = await authService.loginUser(
      req.body.email,
      req.body.password
    );

    // ✅ Cookie properly set for cross-origin
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // https only
      sameSite: "none", // cross-site cookie
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send minimal user info (avoid password)
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err: any) {
    res.status(401).json({ message: err.message });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
};


// VERIFY OTP
export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    const user = await authService.verifyOtp(email, otp);

    res.json({
      message: "OTP verified successfully",
      user,
    });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};


// RESEND OTP
export const resendOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const result = await authService.generateAndSendOtp(email);
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ message: err.message || "Something went wrong" });
  }
};


export const forgotPassword = async (req: Request, res: Response) => {
  try {
    await authService.forgotPasswordOTP(req.body.email);
    res.json({ message: "Email sent" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body;
    

    const user = await authService.resetPasswordOTP(
      email,
      otp,
      newPassword
    );

    res.json(user);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const user = await authService.updateProfile(req.user!.id, req.body);
    res.json(user);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};


// Get current logged-in user
export const getProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const user = await authService.getUserById(req.user.id);

    res.json(user);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Get all users (admin only)
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await authService.getAllUsers();

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ----------------------
// Update User Role
// ----------------------
export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { role } = req.body;

    const updatedUser = await authService.updateUserRole(id, role); // ✅ service method
    res.status(200).json({ success: true, user: updatedUser });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ----------------------
// Delete User
// ----------------------
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};