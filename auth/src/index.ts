import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  console.log("Starting up...", process.env.MONGO_URI);

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must present");
  }

  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must present");
  }

  try {
    await mongoose.connect(`${process.env.MONGO_URI}/auth`);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
  }

  app.listen(3000, () => {
    console.log("AUTH Listening on port 3000");
  });
};

start();
