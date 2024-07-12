import { Schema, Document, model } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  username?: string;
}

export const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
  },
});

const User = model<IUser>("User", userSchema);

export default User;
