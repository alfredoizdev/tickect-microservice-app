import { Router, Request, Response } from "express";
import Ticket from "../models/Ticket";
import { NotFoundError, requireAuth } from "@alfticket-app/middleware-app";

const router = Router();

router.get(
  "/api/tickets/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      throw new NotFoundError();
    }

    res.status(200).send(ticket);
  }
);

export { router as showTicketRouter };
