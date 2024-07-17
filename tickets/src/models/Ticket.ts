import { Schema, Document, model, Model } from "mongoose";

export interface ITicket {
  userId: string;
  title: string;
  price: number;
}

interface ITicketModel extends Model<ITicketDoc> {
  build(attrs: ITicket): ITicketDoc;
}

interface ITicketDoc extends Document, ITicket {
  userId: string;
  title: string;
  price: number;
  createdAt?: string;
  updatedAt?: string;
}

export const ticketSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

ticketSchema.statics.build = (attrs: ITicket) => {
  return new Ticket(attrs);
};

ticketSchema.set("toJSON", {
  transform: (doc: any, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

const Ticket = model<ITicketDoc, ITicketModel>("Ticket", ticketSchema);

export default Ticket;