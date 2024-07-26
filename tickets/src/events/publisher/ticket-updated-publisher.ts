import { Subjects } from "../../lib/Events";
import { AbstractSender, TicketUpdatedEvent } from "@alfrmq/rmq-app";

export class TicketUpdatedPublisher extends AbstractSender<
  TicketUpdatedEvent["data"]
> {
  constructor() {
    super(Subjects.TicketUpdated);
  }
  protected prepareMessage(data: TicketUpdatedEvent["data"]): string {
    return JSON.stringify({ message: "Ticket updated", data });
  }
}
