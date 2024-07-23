import { Router, Request, Response } from "express";
import {
  requireAuth,
  NotFoundError,
  NotAuthorizedError,
} from "@alfticket-app/middleware-app";
import { Order } from "../models/Order";
import { OrderStatus } from "../types/order-status";
import { OrderCancelledPublisher } from "../events/publishers/order-cacelled-publisher";
import amqplib from "amqplib";

const router = Router();

router.delete(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate("ticket");

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    // publish an event saying this order was cancelled

    const connection = await amqplib.connect("amqp://localhost");
    const sender = new OrderCancelledPublisher();

    try {
      sender.setConnection(connection);

      if (!sender.checkConnection()) {
        throw new Error("Connection not established");
      }

      sender.send({
        id: order.id,
        version: order.version,
        ticket: { id: order.ticket.id },
      });
    } catch (error) {
      console.error("Failed to send message", error);
    }

    res.send(order);
  }
);

export { router as deleteOrderRouter };
