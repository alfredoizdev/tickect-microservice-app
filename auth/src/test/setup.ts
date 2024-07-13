import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import mongoose from "mongoose";
import { app } from "../app";

declare global {
  var getCookieSignup: () => Promise<string[]>;
}

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = "test";
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }

  await mongoose.connection.close();
});

global.getCookieSignup = async () => {
  const email = "test@email.com";
  const password = "password";
  const username = "test";

  const response = await request(app)
    .post("/api/users/signup")
    .send({ email, password, username })
    .expect(201);

  const cookie = response.get("Set-Cookie") || [];

  return cookie;
};
