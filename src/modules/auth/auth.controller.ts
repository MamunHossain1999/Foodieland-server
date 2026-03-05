import { Request, Response } from "express";
import * as authService from "./auth.service";

export const register = async (req: Request, res: Response) => {
  try {
    
    const { user, token } = await authService.registerUser(req.body);
    res.cookie("token", token, { httpOnly: true });
    res.status(201).json(user);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { user, token } = await authService.loginUser(req.body.email, req.body.password);
    res.cookie("token", token, { httpOnly: true });
    res.json(user);
  } catch (err: any) {
    res.status(401).json({ message: err.message });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    await authService.forgotPassword(req.body.email);
    res.json({ message: "Email sent" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const user = await authService.resetPassword(req.params.token as string, req.body.password);
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