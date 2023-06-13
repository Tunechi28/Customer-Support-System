import { Schema, model, Document, Types } from "mongoose";
import { Comment, Note, commentsSchema, notesSchema, IComment } from "./comment-notes.model";

export type Comments = {
    userId?: string
    text: string
    date: Date
    commentBy: 'customer' | 'admin' | 'support-agent'
    deleted: boolean
}

enum TicketType {
    failed_transaction = "failed_transaction",
    pending_transaction = "pending_transaction",
    account_blocked = "account_blocked",
    account_deactivated = "account_deactivated",
    account_closed = "account_closed",
    account_hacked = "account_hacked",
    account_suspended = "account_suspended",
    enquiry = "enquiry",
    charge_back = "charge_back",
    other = "other"
}

export type Notes = {
    userId: string
    text: string
}
enum Status {
    open = "open",
    assigned = "assigned",
    pending_customer = "pending_customer",
    on_hold = "on_hold",
    pending_third_party = "pending_third_party",
    resolved = "resolved"
}

interface ITicket extends Document {
    id: string;
    subject: string
    issue: string
    customerId: Types.ObjectId
    isAssigned: boolean
    assigneeId?: string
    status: Status
    ticketType: TicketType
    comments?: Comments[];
    notes?: Notes[]
    SLA?: string
    createdAt?: Date;
    updatedAt?: Date;
}

const  ticketSchema = new Schema<ITicket>(
    {
        customerId: { type: Schema.Types.ObjectId, alias: "customer_id", ref: "Customer" },
        subject: {type: String},
        issue: {type: String},
        isAssigned: { type: Boolean, alias: "is_assigned" },
        assigneeId: { type: String, alias: "assignee_id", ref: "User"},
        status: { type: String, enum : Object.values(Status)},
        ticketType: { type: String, enum : Object.values(TicketType)}, 
        comments: [commentsSchema],  
        notes: [notesSchema] ,
        SLA: { type: String},  
        createdAt: { type: Date, default: Date.now, alias: "created_at" },
        updatedAt: { type: Date, default: Date.now, alias: "updated_at" },
    },
    { collection: "tickets" }
);

const Ticket= model<ITicket>("Ticket", ticketSchema);

export {
    Ticket, ITicket
}