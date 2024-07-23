import mongoose from "mongoose";
import { app } from "./app";
import amqplib from "amqplib";
import { TicketCreateListener } from "./events/listener/ticket-create-listener";
import { TicketUpdatedListener } from "./events/listener/ticket-updated-listener";

const start = async () => {
  console.log("Starting up...", process.env.MONGO_URI);

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must present");
  }

  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must present");
  }

  try {
    await mongoose.connect(`${process.env.MONGO_URI}/orders`);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
  }

  const connection = await amqplib.connect("amqp://rabbitmq-service");

  const listenerCreateTicket = new TicketCreateListener();
  const listenerUpdatedTicket = new TicketUpdatedListener();

  await listenerCreateTicket.setConnection(connection);
  await listenerUpdatedTicket.setConnection(connection);

  if (!connection) {
    throw new Error("Failed to connect to RabbitMQ");
  }

  console.log("Connected to RabbitMQ");

  app.listen(3000, () => {
    console.log("AUTH Listening on port 3000");
  });
};

start();
