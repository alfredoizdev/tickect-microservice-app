import { OrderStatus } from "./order-status";

export enum Subjects {
  OrderCreated = "order:created",
  OrderCancelled = "order:cancelled",
  TicketCreated = "ticket:created",
  TicketUpdated = "ticket:updated",
}

export interface OrderCreatedEvent {
  subject: Subjects.OrderCreated;
  data: {
    id: string;
    status: OrderStatus;
    version: number;
    userId: string;
    expiresAt: string;
    ticket: {
      id: string;
      price: number;
    };
  };
}

export interface OrderCancelledEvent {
  subject: Subjects.OrderCancelled;
  data: {
    id: string;
    version: number;
    ticket: {
      id: string;
    };
  };
}

export interface TicketCreateEvent {
  subject: Subjects;
  data: {
    version: number;
    id: string;
    title: string;
    price: number;
    userId: string;
  };
}

export interface TicketUpdatedEvent {
  subject: Subjects;
  data: {
    version: number;
    id: string;
    title: string;
    price: number;
    userId: string;
  };
}
