enum Status {
    open = "open",
    assigned = "assigned",
    pending_customer = "pending_customer",
    on_hold = "on_hold",
    pending_third_party = "pending_third_party",
    resolved = "resolved"
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

export type CreateTicket ={
    customer: any,
    subject: string,
    issue: string,
    status: Status,
    ticketType: TicketType
    isAssigned: boolean
}

export type UpdateTicket = {
    ticketId: string
    subject: string
    issue: string
    ticketType: string 
}

export type addComment = {
    user?: any,
    customer?: any
    text: string
    date: Date
    role: 'admin' | 'support-agent' | 'customer'
    ticketId: string
}

export type updateComment = {
    user?: any,
    customer?: any
    text: string
    ticketId: string
    commentId: string
}

export type deleteComment ={
    user: any,
    customer: any
    ticketId: string
    commentId: string
}

export type addNote = {
    user: any
    text: string
    date: Date
    ticketId: string
}

export type updateNote = {
    text: string
    ticketId: string
    noteId: string
}

export type deleteNote ={
    ticketId: string
    noteId: string
}

export type assignTicket = {
    ticketId: string
    assigneeId: string
}

export type setTicketStatus = {
    ticketId: string
    status: Status
}

export type generateTicketReport = {
    startDate: Date
    endDate: Date
    status: Status
}
