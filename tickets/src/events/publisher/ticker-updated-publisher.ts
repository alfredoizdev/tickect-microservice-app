import { Subjects } from "../../lib/Events";
import { AbstractSender } from "@alfrmq/rmq-app";

interface TicketUpdatedEvent {
  subject: Subjects.TicketUpdated;
  data: {
    id: string;
    title: string;
    price: number;
    userId: string;
  };
}

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
