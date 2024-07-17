import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import { currentUserRouter } from "./routers/current-user";
import { signinRouter } from "./routers/signin";
import { signoutRouter } from "./routers/signout";
import { signupRouter } from "./routers/signup";
import { errorsHandler } from "@alfticket-app/middleware-app";
import { NotFoundError } from "@alfticket-app/middleware-app";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({ signed: false, secure: process.env.NODE_ENV !== "test" })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorsHandler);

export { app };
