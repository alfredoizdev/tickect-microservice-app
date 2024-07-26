import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it("return 401 if user is not authenticated", async () => {
  const response = await request(app).post("/api/tickets").send({});
  expect(response.status).toEqual(401);
});

it("returns 404 is tikect is not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const response = await request(app)
    .get(`/api/tickets/${id}`)
    .set("Cookie", global.getCookieSignup())
    .send({});
  expect(response.status).toEqual(404);
});

it("returns a ticket if the ticket is found", async () => {
  const title = "test";
  const price = 20;

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.getCookieSignup())
    .send({
      title,
      price,
      version: 1,
    })
    .expect(201);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .set("Cookie", global.getCookieSignup())
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});
