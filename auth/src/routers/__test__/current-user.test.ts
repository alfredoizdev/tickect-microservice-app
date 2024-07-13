import request from "supertest";
import { app } from "../../app";

it("Responds with details about the current user", async () => {
  const cookie = await global.getCookieSignup();

  await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .send()
    .expect(200);
});

it("Responds with null if not authenticated", async () => {
  const response = await request(app)
    .get("/api/users/currentuser")
    .send()
    .expect(200);

  expect(response.body.currentUser).toBeNull();
});
