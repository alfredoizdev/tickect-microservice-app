import { Router, Request, Response } from "express";
import { requireAuth, validateRequest } from "@alfticket-app/middleware-app";
import { body } from "express-validator";
import Ticket from "../models/Ticket";
import { TicketCreatedSender } from "../events/publisher/ticket-create-publisher";
import amqplib from "amqplib";

const router = Router();

router.post(
  "/api/tickets",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    });

    await ticket.save();

    const connection = await amqplib.connect("amqp://rabbitmq-service");

    const sender = new TicketCreatedSender();

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
      });
    } catch (error) {
      console.error("Failed to send message", error);
    }

    res.status(201).send(ticket);
  }
);

export { router as newTicketRouter };
