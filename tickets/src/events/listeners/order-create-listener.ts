import { AbstractListener, OrderCreatedEvent, Subjects } from "@alfrmq/rmq-app";
import Ticket from "../../models/Ticket";
import { TicketUpdatedPublisher } from "../publisher/ticket-updated-publisher";

export class OrderCreateListener extends AbstractListener<OrderCreatedEvent> {
  constructor() {
    super(Subjects.OrderCreated);
  }

  async handleMessage(message: string): Promise<void> {
    const data = JSON.parse(message).data;

    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    ticket.set({ orderId: data.id });
    await ticket.save();

    const publisherTiken = new TicketUpdatedPublisher();

    if (this.connection) {
      await publisherTiken.setConnection(this.connection);
    } else {
      throw new Error("Connection not found");
    }

    await publisherTiken.send({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
      orderId: ticket.orderId,
    });
  }
}
