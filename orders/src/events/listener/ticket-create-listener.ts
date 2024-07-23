import { AbstractListener, Subjects, TicketCreateEvent } from "@alfrmq/rmq-app";
import { Ticket } from "../../models/Ticket";

export class TicketCreateListener extends AbstractListener<TicketCreateEvent> {
  constructor() {
    super(Subjects.TicketCreated);
  }

  async handleMessage(message: string): Promise<void> {
    const data = JSON.parse(message).data as TicketCreateEvent["data"];

    const ticket = Ticket.build({
      id: data.id,
      title: data.title,
      price: data.price,
      version: data.version,
    });

    await ticket.save();
  }
}
