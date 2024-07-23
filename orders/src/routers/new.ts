import mongoose from "mongoose";
import { Router, Request, Response } from "express";
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  BadRequestError,
} from "@alfticket-app/middleware-app";
import { body } from "express-validator";
import { Ticket } from "../models/Ticket";
import { Order } from "../models/Order";
import { OrderStatus } from "../types/order-status";
import { OrderCreatePublisher } from "../events/publishers/order-create-publisher";
import amqplib from "amqplib";

const router = Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("TicketId must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    // find the ticket the user is trying to order in the database
    const { ticketId } = req.body;

    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      throw new NotFoundError();
    }

    // make sure that this ticket is not already reserved

    const isReserved = await ticket.isReserved();

    if (isReserved) {
      throw new BadRequestError("Ticket is already reserved");
    }

    // calculate an expiration date for this order

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // build the order and save it to the database

    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    });

    await order.save();

    // publish an event saying that an order was created
    const connection = await amqplib.connect("amqp://rabbitmq-service");

    try {
      const sender = new OrderCreatePublisher();
      await sender.setConnection(connection);

      if (!sender.checkConnection()) {
        throw new Error("Failed to set connection and channel for sender");
      }

      await sender.send({
        id: order.id,
        status: order.status,
        userId: order.userId,
        expiresAt: order.expiresAt.toISOString(),
        version: order.version,
        ticket: {
          id: ticket.id,
          price: ticket.price,
        },
      });
    } catch (error) {
      console.error("Failed to send message", error);
    }

    res.status(201).send(order);
  }
);

export { router as newOrderRouter };
