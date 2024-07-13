import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import { currentUserRouter } from "./routers/current-user";
import { signinRouter } from "./routers/signin";
import { signoutRouter } from "./routers/signout";
import { signupRouter } from "./routers/signup";
import { errorsHandler } from "./middleware/error-handler";
import { NotFoundError } from "./erros/not-found-error";
import mongoose from "mongoose";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(cookieSession({ signed: false, secure: true }));

const mongoUri = process.env.MONGO_URI;

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorsHandler);

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must present");
  }

  if (!mongoUri) {
    throw new Error("MONGO_URI must be defined");
  }

  try {
    await mongoose.connect(`${mongoUri}/auth`);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
  }

  app.listen(3000, () => {
    console.log("AUTH Listening on port 3000");
  });
};

start();
