export enum Subjects {
  TicketCreated = "ticket:created",
  TicketUpdated = "ticket:updated",
}

export interface TicketCreateEvent {
  subject: Subjects;
  data: {
    id: string;
    title: string;
    price: number;
    userId: string;
  };
}

export interface TicketUpdatedEvent {
  subject: Subjects;
  data: {
    id: string;
    title: string;
    price: number;
    userId: string;
  };
}
