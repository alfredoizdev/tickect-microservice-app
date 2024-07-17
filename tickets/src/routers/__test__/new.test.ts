import request from "supertest";
import { app } from "../../app";
import Ticket from "../../models/Ticket";

it("has a route handler listening to /api/tickets for post requests", async () => {
  const response = await request(app).post("/api/tickets").send({});
  expect(response.status).not.toEqual(404);
});

it("can only be accessed if the user is signed in", async () => {
  await request(app).post("/api/tickets").send({}).expect(401);
});

it("returns a status other than 401 if the user is signed in", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.getCookieSignup())
    .send({});

  expect(response.status).not.toEqual(401);
});

it("returns an error if an invalid title is provided", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.getCookieSignup())
    .send({
      title: "",
      price: 10,
    });

  expect(response.status).toEqual(400);
});

it("returns an error if an invalid price is provided", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.getCookieSignup())
    .send({
      title: "test",
      price: -10,
    });

  expect(response.status).toEqual(400);
});

it("creates a ticket with valid inputs", async () => {
  const title = "test";
  const price = 20;
  // add in a check to make sure a ticket was saved
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.getCookieSignup())
    .send({
      title,
      price,
    })
    .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(price);
  expect(tickets[0].title).toEqual(title);
});
