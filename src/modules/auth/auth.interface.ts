export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  avatar?: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  otp?: string;                   
  otpExpire?: Date;
}

export interface IUserPayload {
  id: string;
  role: "user" | "admin";
}
