import { User } from "./auth.model";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { IUser } from "./auth.interface";
import { generateToken } from "../../utils/generateToken";
import { sendEmail } from "../../utils/sendEmail";



export const registerUser = async (data: IUser) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const user = await User.create({ ...data, password: hashedPassword });
  const token = generateToken({ id: user._id.toString(), role: user.role });
  return { user, token };
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = generateToken({ id: user._id.toString(), role: user.role });
  return { user, token };
};

export const forgotPassword = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const resetToken = crypto.randomBytes(20).toString("hex");
  user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  user.resetPasswordExpire = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  await user.save();

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  await sendEmail(user.email, "Password Reset", `Reset your password: ${resetUrl}`);
};

export const resetPassword = async (token: string, newPassword: string) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: new Date() },
  });
  if (!user) throw new Error("Token invalid or expired");

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  return user;
};

export const updateProfile = async (userId: string, data: Partial<IUser>) => {
  if (data.password) data.password = await bcrypt.hash(data.password, 10);
  const user = await User.findByIdAndUpdate(userId, data, { new: true });
  return user;
};
export const getUserById = async (userId: string) => {
  const user = await User.findById(userId).select("-password"); // password exclude
  if (!user) throw new Error("User not found");
  return user;
};