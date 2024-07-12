import { Response, Request, Router } from "express";
import { body, validationResult } from "express-validator";
import { RequestValidationError } from "../erros/request-validation-error";

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
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    const { email, password, username } = req.body;

    // creating user

    res.send({ email, password, username });
  }
);

export { router as signupRouter };
