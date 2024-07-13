import request from "supertest";
import { app } from "../../app";

it("returns a 201 on successful signup", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "alfredo@email.com",
      password: "password",
      username: "alfredo",
    })
    .expect(201);
});

it("returns a 400 with an invalid email", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "alfredoemail.com",
      password: "password",
      username: "alfredo",
    })
    .expect(400);
});

it("returns a 400 with an invalid password", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "alfredo@eail.com",
      password: "pa",
      username: "alfredo",
    })
    .expect(400);
});

it("returns a 400 with an invalid username", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "alfredo@email.com",
      password: "password",
      username: "",
    })
    .expect(400);
});

it("disallowed dupliacet email", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@email.com",
      password: "password",
      username: "alfredo",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@email.com",
      password: "password",
      username: "alfredo",
    })
    .expect(400);
});

it("sets a cookie after successful signup", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@email.com",
      password: "password",
      username: "alfredo",
    })
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});
