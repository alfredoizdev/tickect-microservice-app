import { Response, Request, Router } from "express";
import { currentUser } from "@alfticket-app/middleware-app";

const router = Router();

router.get(
  "/api/users/currentuser",
  currentUser,
  (req: Request, res: Response) => {
    res.send({ currentUser: req.currentUser || null });
  }
);

export { router as currentUserRouter };
