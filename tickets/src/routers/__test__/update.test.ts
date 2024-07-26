import request from "supertest";
import { app } from "../../app";
import mongoose, { version } from "mongoose";

it("return 404 if provider id is no exist", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const response = await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.getCookieSignup())
    .send({
      title: "test",
      price: 20,
      version: 1,
    });

  expect(response.status).toEqual(404);
});

it("return 401 if user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const response = await request(app).put(`/api/tickets/${id}`).send({
    title: "test",
    price: 20,
    version: 1,
  });

  expect(response.status).toEqual(401);
});

it("return 401 if user does not own the ticket", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.getCookieSignup())
    .send({
      title: "test",
      price: 20,
      version: 1,
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", global.getCookieSignup())
    .send({
      title: "test",
      price: 20,
    })
    .expect(401);
});

it("return 400 if user provide invalid title or price", async () => {
  const cookie = global.getCookieSignup();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "test",
      price: 20,
      version: 1,
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 20,
      version: 1,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "test",
      price: -20,
      version: 1,
    })
    .expect(400);
});

it("update ticket is user provider valid inputs", async () => {
  const cookie = global.getCookieSignup();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "test",
      price: 20,
      version: 1,
    })
    .expect(201);

  const newTitle = "new test";

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: newTitle,
      price: 20,
      version: 1,
    })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual(newTitle);
});
