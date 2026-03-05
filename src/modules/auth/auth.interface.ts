export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
}

export interface IUserPayload {
  id: string;
  role: "user" | "admin";
}
