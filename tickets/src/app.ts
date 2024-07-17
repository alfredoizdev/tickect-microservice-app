import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import {
  errorsHandler,
  currentUser,
  NotFoundError,
} from "@alfticket-app/middleware-app";
import { newTicketRouter } from "./routers/new";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({ signed: false, secure: process.env.NODE_ENV !== "test" })
);

app.use(currentUser);

app.use(newTicketRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorsHandler);

export { app };
