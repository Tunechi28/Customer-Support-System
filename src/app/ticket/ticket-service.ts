import * as TicketRepository from "./ticket-repository"
import * as TicketTypes from "./ticket-types"
import * as userRepository from "../user/user-repository";

enum Status {
    open = "open",
    assigned = "assigned",
    pending_customer = "pending_customer",
    on_hold = "on_hold",
    pending_third_party = "pending_third_party",
    resolved = "resolved"
}


export const createTicket = async(payload: TicketTypes.CreateTicket) => {
    try{
    const ticketData = {
        customerId: payload.customer.id,
        subject: payload.subject,
        issue: payload.issue,
        status: Status.open,
        ticketType : payload.ticketType,
        isAssigned: false
    }
    const ticket  = await TicketRepository.createTicket(ticketData)
    if(!ticket){
        throw new Error("Unable to create Ticket")
    }

    return ticket
}catch(err){
    throw new Error(err.message)
}
}

export const deleteTicket = async(ticketId: string) => {
    try{
        const ticket = await TicketRepository.deleteTicket(ticketId)
        return ticket
    }catch(err){
        throw new Error(err.message)
    }
}

export const updateTicket = async(payload: TicketTypes.UpdateTicket) =>{
    try{
        let ticket = await TicketRepository.findTicketById(payload.ticketId)
        if(!ticket) throw new Error("unable to find ticket")
        const ticketData = {
            subject: payload.subject? payload.subject : ticket.subject,
            issue: payload.issue? payload.issue : ticket.issue,
            ticketType: payload.ticketType? payload.ticketType as any : ticket.ticketType
        }        
        ticket = await TicketRepository.updateTicket(payload.ticketId, ticketData)
        return ticket

    }catch(err){
        throw new Error(err.message)
    }
}

export const viewTicketDetails = async (ticketId: string) => {
    try{
        const ticket = TicketRepository.findTicketById(ticketId)
        if(!ticket) throw new Error("unable to find ticket")
        return ticket
    }catch(err){
        throw new Error(err.message)
    }
}

export const getCommentsForTicket = async(ticketId: string) => {
    try{
        const comments = await TicketRepository.getCommentsForTicket(ticketId)
        return comments
    }catch(err){
        throw new Error(err.message)
    }
}

export const addComment = async(payload: TicketTypes.addComment) => {
    try{
        const commentData = {
            userId: payload.user? payload.user.id : payload.customer.id,
            text: payload.text,
            date: new Date(Date.now()),
            deleted: false,
            commentBy: payload.user && payload.user.role? payload.user.role : 'customer'
        }
        const ticket = TicketRepository.addCommentToTicket(payload.ticketId, commentData)

        return ticket
    }catch(err){
        throw new Error(err.message)
    }
}

export const updateComment = async(payload: TicketTypes.updateComment) => {
    try{
        const commentData = {
            text : payload.text,
            userId: payload.user? payload.user.id : payload.customer.id,
        }
        const ticket = TicketRepository.updateCommentInTicket(payload.ticketId, payload.commentId, commentData)
        return ticket
    }catch(err){
        throw new Error(err.message)
    }
}

export const deleteComment = async(payload: TicketTypes.deleteComment) => {
    try{
        const userId = payload.user? payload.user.id : payload.customer.id
        const ticket = TicketRepository.deleteCommentFromTicket(payload.ticketId, payload.commentId, userId)
        return ticket
    }catch(err){
        throw new Error(err.message)
    }
}

export const addNote = async(payload: TicketTypes.addNote) => {
    try{
        const noteData = {
            userId: payload.user.id,
            text: payload.text,
            date: new Date(Date.now()),
            deleted: false,
        }
        const ticket = TicketRepository.addNoteToTicket(payload.ticketId, noteData)

        return ticket
    }catch(err){
        throw new Error(err.message)
    }
}

export const updateNote = async(payload: TicketTypes.updateNote) => {
    try{
        const noteData = {
            text : payload.text
        }
        const ticket = TicketRepository.updateNoteInTicket(payload.ticketId, payload.noteId, noteData)
        return ticket
    }catch(err){
        throw new Error(err.message)
    }
}

export const deleteNote = async(payload: TicketTypes.deleteNote) => {
    try{
        const ticket = TicketRepository.deleteNoteFromTicket(payload.ticketId, payload.noteId)
        return ticket
    }catch(err){
        throw new Error(err.message)
    }
}


export const assignTicket = async(payload: TicketTypes.assignTicket) =>{
    try{
        console.log("payload", payload)
        let ticket = await TicketRepository.findTicketById(payload.ticketId)
        if(!ticket) throw new Error("unable to find ticket")
        const ticketData = {
            status : Status.assigned,
            assigneeId: payload.assigneeId,
            isAssigned: true
        }        

        const assignee = await userRepository.findUser({_id: payload.assigneeId})
        if(!assignee) throw new Error("unable to find support agent")
        if (assignee.role !== 'support-agent') throw new Error("user is not a support agent")
        ticket = await TicketRepository.updateTicket(payload.ticketId, ticketData)
        return ticket
    }catch(err){
        throw new Error(err.message)
    }
}

export const unassignTicket = async(ticketId: string) =>{
    try{
        let ticket = await TicketRepository.findTicketById(ticketId)
        if(!ticket) throw new Error("unable to find ticket")
        const ticketData = {
           status: Status.open,
           assigneeId: '',
           isAssigned: false
        }        
        ticket = await TicketRepository.updateTicket(ticketId, ticketData)
        return ticket

    }catch(err){
        throw new Error(err.message)
    }
}

export const setTicketStatus = async(payload: TicketTypes.setTicketStatus) =>{
    try{
        let ticket = await TicketRepository.findTicketById(payload.ticketId)
        if(!ticket) throw new Error("unable to find ticket")
        const ticketData = {
            status: payload.status,
        }        
        ticket = await TicketRepository.updateTicket(payload.ticketId, ticketData)
        return ticket

    }catch(err){
        throw new Error(err.message)
    }
}

export const generateTicketReport = async(payload: TicketTypes.generateTicketReport) => {
    try{
        const startDate = new Date(payload.startDate)
        const endDate = new Date(payload.endDate)
        const tickets = await TicketRepository.getAllTickets(startDate, endDate, payload.status)

        return tickets      

    }catch(err){
        throw new Error(err.message)
    }
}