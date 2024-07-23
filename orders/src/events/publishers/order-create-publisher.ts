import { AbstractSender, Subjects, OrderCreatedEvent } from "@alfrmq/rmq-app";

export class OrderCreatePublisher extends AbstractSender<
  OrderCreatedEvent["data"]
> {
  constructor() {
    super(Subjects.OrderCreated);
  }

  protected prepareMessage(data: OrderCreatedEvent["data"]): string {
    return JSON.stringify({ message: "Order created", data });
  }
}
