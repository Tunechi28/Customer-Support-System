import * as TicketTypes from "./ticket-types";
import * as ticketService from "./ticket-service";
import * as ticketSchema from "./ticket-schema";
import validate from "../../utils/middleware/validateSchema";
import { removeKeysFromObject } from "../../utils";
const pdfkit = require('pdfkit');
const csv = require('fast-csv');


export const createTicket = async (params: TicketTypes.CreateTicket) => {
    const payload = await validate(params, ticketSchema.createTicketSchema);
    const data = await ticketService.createTicket(payload);
    return { message: "Support Ticket created successfully", data };
};

export const updateTicket = async (params: TicketTypes.UpdateTicket) => {
    const payload = await validate(params, ticketSchema.updateTicketSchema);
    const data = await ticketService.updateTicket({ ...payload, ticketId: (params as any).params.ticketId });
    return { message: "Support Ticket updated successfully", data };
};

export const deleteTicket = async (params: any) => {
    const data = await ticketService.deleteTicket(params.param.ticketId);
    return { message: "Support Ticket deleted successfully", data };
};

export const viewTicketDetails = async(params: any) => {
    const data = await ticketService.viewTicketDetails(params.params.ticketId);
    return { message: "Ticket Details", data };
}

export const viewTicketStatus = async(params: any) => {
    let data = await ticketService.viewTicketDetails(params.params.ticketId);
    data = removeKeysFromObject((data as any).toObject(), ["assigneeId", "notes", "SLA"])
    return { message: "Ticket Status", data };
}

export const addComment = async(params: TicketTypes.addComment) => {
    const payload = await validate(params, ticketSchema.addOrUpdateCommentSchema);
    const data = await ticketService.addComment({...payload, ticketId: (params as any).params.ticketId});
    return { message: "Comment added successfully", data };    
}

export const updateComment = async(params: TicketTypes.updateComment) => {
    const payload = await validate(params, ticketSchema.addOrUpdateCommentSchema);
    const data = await ticketService.updateComment({...payload, ticketId: (params as any).params.ticketId});
    return { message: "Comment updated successfully", data };    
}

export const deleteComment = async(params: TicketTypes.deleteComment) => {
    const payload = await validate(params, ticketSchema.deleteCommentSchema);
    const data = await ticketService.deleteComment({...payload, ticketId: (params as any).params.ticketId});
    return { message: "Comment deleted successfully", data };    
}

export const addNote = async(params: TicketTypes.addNote) => {
    const payload = await validate(params, ticketSchema.addOrUpdateNoteSchema);
    const data = await ticketService.addNote({...payload, ticketId: (params as any).params.ticketId});
    return { message: "Note added successfully", data };    
}

export const updateNote = async(params: TicketTypes.updateNote) => {
    const payload = await validate(params, ticketSchema.addOrUpdateNoteSchema);
    const data = await ticketService.updateNote({...payload, ticketId: (params as any).params.ticketId});
    return { message: "Note updated successfully", data };    
}

export const deleteNote = async(params: TicketTypes.deleteNote) => {
    const payload = await validate(params, ticketSchema.deleteNoteSchema);
    const data = await ticketService.deleteNote({...payload, ticketId: (params as any).params.ticketId});
    return { message: "Note deleted successfully", data };    
}

export const assignTicket = async (params: TicketTypes.assignTicket) => {
    const payload = await validate(params, ticketSchema.assignTicketSchema);
    const data = await ticketService.assignTicket({ ...payload, ticketId: (params as any).params.ticketId });
    return { message: "Support Ticket has been assigned successfully", data };
};

export const unAssignTicket = async (params: any) => {
    const data = await ticketService.unassignTicket(params.params.ticketId);
    return { message: "Support Ticket has been unassigned successfully", data };
};

export const setTicketStatus = async (params: TicketTypes.setTicketStatus) => {
    const payload = await validate(params, ticketSchema.setTicketStatusSchema);
    const data = await ticketService.setTicketStatus({ ...payload, ticketId: (params as any).params.ticketId });
    return { message: "Support Ticket updated successfully", data };
};

export  const getReports = async (req, res) => {
    try {
        const { startDate, endDate, format, status } = req.query;   
        const tickets = await ticketService.generateTicketReport({startDate, endDate, status});
    
        if (format === 'csv') {
          res.setHeader('Content-Disposition', 'attachment; filename="closed_tickets.csv"');
          res.setHeader('Content-Type', 'text/csv');
    
          csv.writeToStream(res, tickets, { headers: true, transform: ticket => ({
            ...ticket,
            createdAt: ticket.createdAt.toISOString(),
            updatedAt: ticket.updatedAt.toISOString()
          }) });
        } else if (format === 'pdf') {
          res.setHeader('Content-Disposition', 'attachment; filename="closed_tickets.pdf"');
          res.setHeader('Content-Type', 'application/pdf');
    
          const doc = new pdfkit();
          doc.pipe(res);
    
          doc.fontSize(16).text('Closed Tickets Report', { align: 'center' });
          doc.moveDown();
          tickets.forEach((ticket, index) => {
            doc.fontSize(12).text(`Ticket #${index + 1}`);
            doc.fontSize(10).text(`Subject: ${ticket.subject}`);
            doc.fontSize(10).text(`Issue: ${ticket.issue}`);
            doc.fontSize(10).text(`Is Assigned: ${ticket.isAssigned}`);
            doc.fontSize(10).text(`Assignee ID: ${ticket.assigneeId}`);
            doc.fontSize(10).text(`Ticket Type: ${ticket.ticketType}`);
            doc.fontSize(10).text(`SLA: ${ticket.SLA}`);
            doc.fontSize(10).text(`Created At: ${ticket.createdAt}`);
            doc.fontSize(10).text(`Updated At: ${ticket.updatedAt}`);
            doc.moveDown();
          });
    
          doc.end();
        } else {
          res.status(400).json({ message: 'Invalid format specified' });
        }
      } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }

