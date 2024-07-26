import mongoose from "mongoose";
import { app } from "./app";
import { OrderCreateListener } from "./events/listeners/order-create-listener";
import amqplib from "amqplib";

const start = async () => {
  console.log("Starting up...", process.env.MONGO_URI);

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must present");
  }

  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must present");
  }

  try {
    await mongoose.connect(`${process.env.MONGO_URI}/tickets`);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
  }

  const connection = await amqplib.connect("amqp://rabbitmq-service");

  const orderCreateListener = new OrderCreateListener();
  await orderCreateListener.setConnection(connection);

  if (!connection) {
    throw new Error("Failed to connect to RabbitMQ");
  }

  console.log("Connected to RabbitMQ");

  app.listen(3000, () => {
    console.log("AUTH Listening on port 3000");
  });
};

start();
