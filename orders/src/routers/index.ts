import { Router, Request, Response } from "express";
import { requireAuth } from "@alfticket-app/middleware-app";
import { Order } from "../models/Order";

const router = Router();

router.get("/api/orders", requireAuth, async (req: Request, res: Response) => {
  const orders = await Order.find({
    userId: req.currentUser!.id,
  }).populate("ticket");

  res.send(orders);
});

export { router as indexOrdersRouter };
