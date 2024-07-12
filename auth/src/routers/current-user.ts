import { Response, Request, Router } from "express";

const router = Router();

router.get("/api/users/currentuser", (req: Request, res: Response) => {
  res.send({ msg: "Hi there!" });
});

export { router as currentUserRouter };
