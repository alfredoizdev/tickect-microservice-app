import request from "supertest";
import { app } from "../../app";

const createTicket = () => {
  return request(app)
    .post("/api/tickets")
    .set("Cookie", global.getCookieSignup())
    .send({
      title: "test",
      price: 20,
      version: 1,
    });
};

it("can fetch a list of tickets", async () => {
  const title = "test";
  const price = 20;

  await createTicket();
  await createTicket();

  const response = await request(app)
    .get("/api/tickets")
    .set("Cookie", global.getCookieSignup())
    .send()
    .expect(200);

  expect(response.body.length).toEqual(2);
});
