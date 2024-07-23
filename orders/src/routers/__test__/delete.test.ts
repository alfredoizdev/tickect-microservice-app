import request from "supertest";
import { app } from "../../app";
import { Order } from "../../models/Order";
import { Ticket } from "../../models/Ticket";
import mongoose from "mongoose";
import { OrderStatus } from "@alfrmq/rmq-app";

it("marks an order as cancelled", async () => {
  // Create a ticket
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
  });
  await ticket.save();

  const user = global.getCookieSignup();

  // Make a request to build an order with this ticket
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // Make request to fetch the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(200);

  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("return an error if user don't own the order", async () => {
  // Create a ticket
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
  });
  await ticket.save();

  const user = global.getCookieSignup();

  // Make a request to build an order with this ticket
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // Make request to fetch the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", global.getCookieSignup())
    .send()
    .expect(401);
});

it("return error order is not found", async () => {
  const ticketId = new mongoose.Types.ObjectId();
  await request(app)
    .delete(`/api/orders/${ticketId}`)
    .set("Cookie", global.getCookieSignup())
    .send()
    .expect(404);
});
