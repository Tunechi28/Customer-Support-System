import { Ticket, ITicket, Comments } from "../../database/models/ticket-model/ticket.model";
import { Comment, IComment, Note, INote } from "../../database/models/ticket-model/comment-notes.model";

/**
 * Create a ticket.
 * @param ticketData - Ticket data.
 * @returns The created ticket.
 */
export const createTicket = async (ticketData: Partial<ITicket>): Promise<ITicket> => {
  const ticket = new Ticket(ticketData);
  return ticket.save();
}

/**
 * Delete a ticket by setting the deleted flag to true.
 * @param ticketId - ID of the ticket to delete.
 * @returns The deleted ticket.
 */
export const deleteTicket = async (ticketId: string): Promise<ITicket | null> => {
  return Ticket.findByIdAndUpdate(ticketId, { deleted: true }, { new: true });
}

/**
 * Update a ticket.
 * @param ticketId - ID of the ticket to update.
 * @param ticketData - Updated ticket data.
 * @returns The updated ticket.
 */
export const updateTicket = async (ticketId: string, ticketData: Partial<ITicket>): Promise<ITicket | null> => {
  return Ticket.findByIdAndUpdate(ticketId, ticketData, { new: true });
}

/**
 * Find a ticket by ID.
 * @param ticketId - ID of the ticket to find.
 * @returns The found ticket.
 */
export const findTicketById = async(ticketId: string): Promise<ITicket | null> => {
  return Ticket.findById(ticketId);
}

/**
 * Get all tickets, under certain conditions(like resolved, open, etc)
 * @returns The list of tickets
 */
export const getAllTickets = async(startDate: Date, endDate: Date, status: string): Promise<ITicket[]> => {

  const tickets = await Ticket.find({
    status: status,
    createdAt: {
      $gte: startDate,
      $lte: endDate
    }
  })
    .select('-comments -notes') // Exclude comments and notes from the report
    .lean(); 

  return tickets;
}

/**
 * Get all Customer tickets.
 * @returns All tickets.
 */
export const getAllCustomerTickets = async(customerId: string, take:number|undefined, cur: string | undefined): Promise<ITicket[]> => {
    return Ticket.find({
        customerId
    })
    .sort({ createdAt: "desc" })
      .limit(take || 0)
      .skip(cur ? 1 : 0)
      .exec();
  }

/**
 * Add a note to a ticket and update the note table.
 * @param ticketId - ID of the ticket to add the note to.
 * @param noteData - Note data to add.
 * @returns The updated ticket.
 */
export const addNoteToTicket = async(ticketId: string, noteData: Partial<INote>): Promise<ITicket | null> => {
  const ticket = await Ticket.findByIdAndUpdate(
    ticketId,
    { $push: { notes: noteData } },
    { new: true }
  );

  if (ticket) {
    const note = new Note(noteData);
    await note.save();
  }

  return ticket;
}

/**
 * Delete a note from a ticket and remove it from the note table.
 * @param ticketId - ID of the ticket to delete the note from.
 * @param noteId - ID of the note to delete.
 * @returns The updated ticket.
 */
export const deleteNoteFromTicket = async(ticketId: string, noteId: string): Promise<ITicket | null> =>{
  const ticket = await Ticket.findByIdAndUpdate(
    ticketId,
    { $pull: { notes: { _id: noteId } } },
    { new: true }
  );

  if (ticket) {
    await Note.findByIdAndDelete(noteId);
  }

  return ticket;
}

/**
 * Update a note in a ticket and update the note table.
 * @param ticketId - ID of the ticket that contains the note.
 * @param noteId - ID of the note to update.
 * @param noteData - Updated note data.
 * @returns The updated ticket.
 */
export const updateNoteInTicket = async (
  ticketId: string,
  noteId: string,
  noteData: Partial<INote>
): Promise<ITicket | null> => {
  const updateFields: any = {};

  // Iterate over the noteData and add the fields to the updateFields object
  for (const key in noteData) {
    if (noteData.hasOwnProperty(key)) {
      updateFields[`notes.$.${key}`] = noteData[key];
    }
  }

  const ticket = await Ticket.findOneAndUpdate(
    { _id: ticketId, "notes._id": noteId },
    { $set: updateFields },
    { new: true }
  );

  if (ticket) {
    await Note.findByIdAndUpdate(noteId, noteData);
  }

  return ticket;
};


/**
 * Get comments for a ticket.
 * @param ticketId - ID of the ticket to retrieve comments from.
 * @returns All comments for the ticket.
 */
export const getCommentsForTicket = async (ticketId: string): Promise<Partial<IComment[]>> => {
    const ticket = await Ticket.findById(ticketId).select('comments');
    return ticket?.comments as any || [];
  }
  
  /**
   * Add a comment to a ticket and update the comment table.
   * @param ticketId - ID of the ticket to add the comment to.
   * @param commentData - Comment data to add.
   * @returns The updated ticket.
   */
export const addCommentToTicket = async (ticketId: string, commentData: Partial<IComment>): Promise<ITicket | null> => {
    const ticket = await Ticket.findById(ticketId);
  
    if (!ticket) {
      throw new Error("ticket not found")
    }
  
    // Check if the commentBy is customer and there are previous comments

    if(commentData.commentBy == 'customer' && ticket.comments?.length == 0){
        throw new Error("cannot comment on ticket that has not been commented on by a support Agent")
    }
      ticket.comments = ticket.comments ?? [];
      ticket.comments.push(commentData as Comments);
      await ticket.save();
      const comment = new Comment(commentData);
      await comment.save();
  
    return ticket;
  }
  

/**
 * Update a comment in a ticket and update the comment table.
 * @param ticketId - ID of the ticket that contains the comment.
 * @param commentId - ID of the comment to update.
 * @param commentData - Updated comment data.
 * @returns The updated ticket.
 */
export const updateCommentInTicket = async (
  ticketId: string,
  commentId: string,
  commentData: Partial<IComment>
): Promise<ITicket | null> => {
  const ticket = await Ticket.findOne({ _id: ticketId, "comments._id": commentId }) as any;

  if (!ticket) {
    throw new Error("Ticket not found");
  }

  const comment = ticket.comments.find((c) => c._id.toString() === commentId);
  if (!comment) {
    throw new Error("Comment not found");
  }

  if (comment.userId !== commentData.userId) {
    throw new Error("Invalid user for comment update");
  }

  comment.text = commentData.text; // Update the comment text or any other desired fields

  await ticket.save();

  await Comment.findByIdAndUpdate(commentId, commentData);

  return ticket;
};


/**
 * Delete a comment from a ticket and update the comment table.
 * @param ticketId - ID of the ticket to delete the comment from.
 * @param commentId - ID of the comment to delete.
 * @returns The updated ticket.
 */
export const deleteCommentFromTicket = async (
  ticketId: string,
  commentId: string,
  userId: string
): Promise<ITicket | null> => {
  const ticket = await Ticket.findById(ticketId) as any;

  if (!ticket) {
    throw new Error("Ticket not found");
  }

  const comment = ticket.comments.find((c) => c._id.toString() === commentId);

  if (!comment) {
    throw new Error("Comment not found");
  }

  if (comment.userId !== userId) {
    throw new Error("Invalid user for comment deletion");
  }

  ticket.comments = ticket.comments.filter((c) => c._id.toString() !== commentId);
  await ticket.save();

  await Comment.findByIdAndUpdate(commentId, { deleted: true });

  return ticket;
};




