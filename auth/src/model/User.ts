import { Schema, Document, model, Model } from "mongoose";
import { Password } from "../services/password";

export interface IUser {
  email: string;
  password: string;
  username?: string;
}

interface IUserModel extends Model<IUserDoc> {
  build(attrs: IUser): IUserDoc;
}

interface IUserDoc extends Document, IUser {
  email: string;
  password: string;
  username?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    username: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }

  done();
});

userSchema.statics.build = (attrs: IUser) => {
  return new User(attrs);
};

userSchema.set("toJSON", {
  transform: (doc: any, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.password;
  },
});

const User = model<IUserDoc, IUserModel>("User", userSchema);

export default User;
