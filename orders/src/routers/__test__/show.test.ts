import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/Ticket";
import mongoose from "mongoose";

it("fetches the order", async () => {
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
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});

it("it return an error if user don't own the order", async () => {
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
    .get(`/api/orders/${order.id}`)
    .set("Cookie", global.getCookieSignup())
    .send()
    .expect(401);
});

it("return an error if order not found", async () => {
  const ticketId = new mongoose.Types.ObjectId();
  await request(app)
    .get(`/api/orders/${ticketId}`)
    .set("Cookie", global.getCookieSignup())
    .send()
    .expect(404);
});
