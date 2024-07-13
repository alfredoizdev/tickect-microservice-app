import request from "supertest";
import { app } from "../../app";

it("Fails when a email that does not exist", async () => {
  return request(app)
    .post("/api/users/signin")
    .send({
      email: "test@email.com",
      password: "password",
    })
    .expect(400);
});

it("Fails when an incorrect password is supplied", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@email.com",
      password: "password",
      username: "test",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signup")
    .send({
      email: "tes@email.com",
      password: "password23121",
    })
    .expect(400);
});

it("Fails when an incorrect email is supplied", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@email.com",
      password: "password",
      username: "test",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signin")
    .send({
      email: "tes1@email.com",
      password: "password",
    })
    .expect(400);
});

it("Responds with a cookie when given valid credentials", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@email.com",
      password: "password",
      username: "test",
    })
    .expect(201);

  const response = await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@email.com",
      password: "password",
    })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});
