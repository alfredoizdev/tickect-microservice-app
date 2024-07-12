import { Response, Request, Router } from "express";

const router = Router();

router.post("/api/users/signout", (req: Request, res: Response) => {
  res.send({ msg: "Hi there!" });
});

export { router as signoutRouter };
