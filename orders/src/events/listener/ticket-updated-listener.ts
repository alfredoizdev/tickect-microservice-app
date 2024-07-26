import {
  AbstractListener,
  Subjects,
  TicketUpdatedEvent,
} from "@alfrmq/rmq-app";
import { Ticket } from "../../models/Ticket";
import { NotFoundError } from "@alfticket-app/middleware-app";

export class TicketUpdatedListener extends AbstractListener<TicketUpdatedEvent> {
  constructor() {
    super(Subjects.TicketUpdated);
  }

  async handleMessage(message: string): Promise<void> {
    const data = JSON.parse(message).data as TicketUpdatedEvent["data"];

    const ticket = await Ticket.findByEvent(data);

    if (!ticket) {
      throw new NotFoundError();
    }

    ticket.set({
      title: data.title,
      price: data.price,
    });

    await ticket.save();
  }
}
