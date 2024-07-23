import { Router, Request, Response } from "express";
import {
  BadRequestError,
  NotFoundError,
  requireAuth,
  validateRequest,
  NotAuthorizedError,
} from "@alfticket-app/middleware-app";
import { body } from "express-validator";
import Ticket from "../models/Ticket";
import { TicketUpdatedPublisher } from "../events/publisher/ticker-updated-publisher";
import amqplib from "amqplib";

const router = Router();

router.put(
  "/api/tickets/:id",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, price } = req.body;

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    ticket.set({
      title,
      price,
    });

    ticket.save();

    const sender = new TicketUpdatedPublisher();

    const connection = await amqplib.connect("amqp://rabbitmq-service");

    try {
      await sender.setConnection(connection);

      if (!sender.checkConnection()) {
        throw new Error("Failed to set connection and channel for sender");
      }

      sender.send({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
        version: ticket.version,
      });
    } catch (error) {
      console.error("Failed to send message", error);
    }

    res.status(200).send(ticket);
  }
);

export { router as updateTicketRouter };
