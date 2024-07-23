import { AbstractSender, Subjects, TicketCreateEvent } from "@alfrmq/rmq-app";

export class TicketCreatedSender extends AbstractSender<
  TicketCreateEvent["data"]
> {
  constructor() {
    super(Subjects.TicketCreated);
  }

  protected prepareMessage(data: TicketCreateEvent["data"]): string {
    return JSON.stringify({ message: "Ticket created", data });
  }
}
