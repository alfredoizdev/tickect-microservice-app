import { Response, Request, Router } from "express";
import { body } from "express-validator";
import User from "../model/User";
import jwt from "jsonwebtoken";
import {
  BadRequestError,
  validateRequest,
} from "@alfticket-app/middleware-app";

const router = Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
    body("username")
      .trim()
      .notEmpty()
      .withMessage("You must supply a username"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password, username } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      throw new BadRequestError("Email in use");
    }

    const user = User.build({ email, password, username });
    await user.save();

    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      process.env.JWT_KEY!
    );

    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(user);
  }
);

export { router as signupRouter };
