import { NextFunction, Request, Response } from "express";
import { CustomError } from "../erros/custom-error";

export const errorsHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Something went wrong", err);

  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  res.status(400).send({
    errors: [{ message: "Something went wrong" }],
  });

  next();
};
