import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/Ticket";

const buildTicket = async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
  });

  await ticket.save();

  return ticket;
};

it("fetches orders for a particular user", async () => {
  const ticketOne = await buildTicket();
  const ticketTwo = await buildTicket();
  const ticketThree = await buildTicket();

  const userOne = global.getCookieSignup();
  const userTwo = global.getCookieSignup();

  await request(app)
    .post("/api/orders")
    .set("Cookie", userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201);

  const { body: orderOne } = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({ ticketId: ticketTwo.id })
    .expect(201);

  const { body: orderTwo } = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({ ticketId: ticketThree.id })
    .expect(201);

  const response = await request(app)
    .get("/api/orders")
    .set("Cookie", userTwo)
    .expect(200);

  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(orderOne.id);
  expect(response.body[1].id).toEqual(orderTwo.id);
  expect(response.body[0].ticket.id).toEqual(ticketTwo.id);
  expect(response.body[1].ticket.id).toEqual(ticketThree.id);
});

it("return an error if the user go for router not exist", async () => {
  await request(app)
    .get("/api/anyway")
    .set("Cookie", global.getCookieSignup())
    .send()
    .expect(404);
});
