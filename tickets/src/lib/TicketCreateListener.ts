import { AbstractListener } from "./AbstractListener";
import { Subjects, TicketCreateEvent } from "./Events";
import amqplib from "amqplib";

class TicketCreatedListener extends AbstractListener<TicketCreateEvent> {
  constructor() {
    super(Subjects.TicketCreated);
  }

  protected handleMessage(message: string): void {
    const parsedMessage = JSON.parse(message);
    console.log("Received message:", parsedMessage);
    // Add your specific message handling logic here
  }
}

(async () => {
  const connection = await amqplib.connect("amqp://localhost");
  const listener = new TicketCreatedListener();
  await listener.setConnection(connection);
})();
