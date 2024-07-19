import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import mongoose from "mongoose";
import { app } from "../app";
import jwt from "jsonwebtoken";

declare global {
  var getCookieSignup: () => string[];
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

global.getCookieSignup = () => {
  const email = "test@email.com";
  const username = "test";

  // build jwt token {id email}
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email,
    username,
  };

  //create JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // build session Object {jwt: MY_JWT}
  const session = { jwt: token };

  // turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // take JSON and encode it as base64

  const base64 = Buffer.from(sessionJSON).toString("base64");

  return [`session=${base64}`];
};
