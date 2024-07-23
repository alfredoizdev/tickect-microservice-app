import { AbstractSender, Subjects, OrderCancelledEvent } from "@alfrmq/rmq-app";

export class OrderCancelledPublisher extends AbstractSender<
  OrderCancelledEvent["data"]
> {
  constructor() {
    super(Subjects.OrderCancelled);
  }

  protected prepareMessage(data: OrderCancelledEvent["data"]): string {
    return JSON.stringify({ message: "Order cancelled", data });
  }
}
