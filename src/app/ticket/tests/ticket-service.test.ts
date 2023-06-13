import * as TicketService from "../ticket-service";
import * as TicketRepository from "../ticket-repository";
import * as userRepository from "../../user/user-repository";
import * as TicketTypes from "../ticket-types";

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

describe("Ticket Service", () => {
  describe("createTicket", () => {
    it("should create a new ticket", async () => {
      const payload: TicketTypes.CreateTicket = {
        customer: { id: "customer123" },
        subject: "Test ticket",
        issue: "Test issue",
        ticketType: TicketType.failed_transaction,
        isAssigned: false,
        status: Status.open
      };

      const ticketData = {
        customerId: payload.customer.id,
        subject: payload.subject,
        issue: payload.issue,
        status: "open",
        ticketType: TicketType.failed_transaction,
        isAssigned: false,
      };

      const createdTicket = {
        _id: "ticket123",
        ...ticketData,
      };

      jest.spyOn(TicketRepository, "createTicket").mockResolvedValueOnce(createdTicket as any);

      const ticket = await TicketService.createTicket(payload);

      expect(TicketRepository.createTicket).toHaveBeenCalledWith(ticketData);
      expect(ticket).toEqual(createdTicket);
    });

    it("should throw an error if unable to create a ticket", async () => {
      const payload: TicketTypes.CreateTicket = {
        customer: { id: "customer123" },
        subject: "Test ticket",
        issue: "Test issue",
        ticketType: TicketType.failed_transaction,
        isAssigned: false,
        status: Status.open
      };

      jest.spyOn(TicketRepository, "createTicket").mockResolvedValueOnce(null as any);

      await expect(TicketService.createTicket(payload)).rejects.toThrow(
        "Unable to create Ticket"
      );
    });
  });

  describe("deleteTicket", () => {
    it("should delete a ticket", async () => {
      const ticketId = "ticket123";

      const deletedTicket = {
        _id: ticketId,
        subject: "Test ticket",
        issue: "Test issue",
        status: Status.open,
        isAssigned: false,
        deleted: true,
      };

      jest.spyOn(TicketRepository, "deleteTicket").mockResolvedValueOnce(deletedTicket as any);

      const ticket = await TicketService.deleteTicket(ticketId);

      expect(TicketRepository.deleteTicket).toHaveBeenCalledWith(ticketId);
      expect(ticket).toEqual(deletedTicket);
    });
  });

    describe("updateTicket", () => {
      it("should update a ticket", async () => {
        const payload: TicketTypes.UpdateTicket = {
          ticketId: "ticket123",
          subject: "Updated subject",
          issue: "Updated issue",
          ticketType: TicketType.failed_transaction,
        };
  
        const existingTicket = {
          _id: payload.ticketId,
          customerId: "customer123",
          subject: "Test ticket",
          issue: "Test issue",
          ticketType: TicketType.failed_transaction,
          status: Status.open,
          isAssigned: false,
        };
  
        const updatedTicketData = {
          subject: payload.subject,
          issue: payload.issue,
          ticketType: payload.ticketType,
        };
  
        const updatedTicket = {
          ...existingTicket,
          ...updatedTicketData,
        };
  
        jest.spyOn(TicketRepository, "findTicketById").mockResolvedValueOnce(existingTicket as any);
        jest.spyOn(TicketRepository, "updateTicket").mockResolvedValueOnce(updatedTicket as any);
  
        const ticket = await TicketService.updateTicket(payload);
  
        expect(TicketRepository.findTicketById).toHaveBeenCalledWith(payload.ticketId);
        expect(TicketRepository.updateTicket).toHaveBeenCalledWith(payload.ticketId, updatedTicketData);
        expect(ticket).toEqual(updatedTicket);
      });
  
      it("should throw an error if the ticket is not found", async () => {
        const payload: TicketTypes.UpdateTicket = {
          ticketId: "nonexistent-ticket",
          issue: "Updated issue",
          subject: "Updated subject",
        ticketType: TicketType.failed_transaction,
        };
  
        jest.spyOn(TicketRepository, "findTicketById").mockResolvedValueOnce(null);
  
        await expect(TicketService.updateTicket(payload)).rejects.toThrow("unable to find ticket");
        expect(TicketRepository.findTicketById).toHaveBeenCalledWith(payload.ticketId);
      });
    });

    describe("viewTicketDetails", () => {
        it("should view ticket details", async () => {
          const ticketId = "ticket123";
    
          const existingTicket = {
            _id: ticketId,
            customerId: "customer123",
            subject: "Test ticket",
            issue: "Test issue",
            ticketType: "Bug",
            status: Status.open,
            isAssigned: false,
          };
    
          jest.spyOn(TicketRepository, "findTicketById").mockResolvedValueOnce(existingTicket as any);
    
          const ticket = await TicketService.viewTicketDetails(ticketId);
    
          expect(TicketRepository.findTicketById).toHaveBeenCalledWith(ticketId);
          expect(ticket).toEqual(existingTicket);
        });
    
        it("should throw an error if the ticket is not found", async () => {
          const ticketId = "nonexistent-ticket";
    
          jest.spyOn(TicketRepository, "findTicketById").mockResolvedValueOnce(null);
    
          await expect(TicketService.viewTicketDetails(ticketId)).resolves.toBeNull();
          expect(TicketRepository.findTicketById).toHaveBeenCalledWith(ticketId);
        });
      });

      describe("addComment", () => {
        it("should add a comment to a ticket", async () => {
          const payload: TicketTypes.addComment = {
            ticketId: "ticket123",
            customer: { id: "customer123" },
            text: "New comment",
            role: "customer",
            date: new Date(),
          };
    
          const commentData = {
            userId: payload.customer.id,
            text: payload.text,
            date: expect.any(Date),
            deleted: false,
            commentBy: "customer",
          };
    
          const ticket = {
            _id: payload.ticketId,
            customerId: payload.customer.id,
            subject: "Test ticket",
            issue: "Test issue",
            ticketType: TicketType.failed_transaction,
            status: Status.open,
            isAssigned: false,
            comments: [commentData],
          };
    
          jest.spyOn(TicketRepository, "addCommentToTicket").mockResolvedValueOnce(ticket as any);
    
          const result = await TicketService.addComment(payload);
    
          expect(TicketRepository.addCommentToTicket).toHaveBeenCalledWith(payload.ticketId, commentData);
          expect(result).toEqual(ticket);
        });
    
        it("should throw an error if unable to add a comment", async () => {
          const payload: TicketTypes.addComment = {
            ticketId: "ticket123",
            customer: { id: "customer123" },
            text: "New comment",
            role: "customer",
            date: new Date(),
          };
    
          jest.spyOn(TicketRepository, "addCommentToTicket").mockResolvedValueOnce(null);
    
          await expect(TicketService.addComment(payload)).resolves.toBeNull();
          expect(TicketRepository.addCommentToTicket).toHaveBeenCalledWith(payload.ticketId, expect.any(Object));
        });
      });
      
      describe("updateComment", () => {
        it("should update a comment in a ticket", async () => {
          const payload: TicketTypes.updateComment = {
            ticketId: "ticket123",
            commentId: "comment123",
            customer: { id: "customer123" },
            text: "Updated comment",
          };
    
          const commentData = {
            text: payload.text,
            userId: payload.customer.id,
          };
    
          const ticket = {
            _id: payload.ticketId,
            customerId: payload.customer.id,
            subject: "Test ticket",
            issue: "Test issue",
            ticketType: TicketType.failed_transaction,
            status: Status.open,
            isAssigned: false,
            comments: [
              { id: payload.commentId, text: "Old comment", userId: payload.customer.id, date: expect.any(Date), deleted: false },
            ],
          };
    
          jest.spyOn(TicketRepository, "updateCommentInTicket").mockResolvedValueOnce(ticket as any);
    
          const result = await TicketService.updateComment(payload);
    
          expect(TicketRepository.updateCommentInTicket).toHaveBeenCalledWith(
            payload.ticketId,
            payload.commentId,
            commentData
          );
          expect(result).toEqual(ticket);
        });
    
        it("should throw an error if unable to update a comment", async () => {
          const payload: TicketTypes.updateComment = {
            ticketId: "ticket123",
            commentId: "comment123",
            customer: { id: "customer123" },
            text: "Updated comment",
          };
    
          jest.spyOn(TicketRepository, "updateCommentInTicket").mockResolvedValueOnce(null);
    
          await expect(TicketService.updateComment(payload)).resolves.toBeNull();
          expect(TicketRepository.updateCommentInTicket).toHaveBeenCalledWith(
            payload.ticketId,
            payload.commentId,
            expect.any(Object)
          );
        });
      });

      describe("addNote", () => {
        it("should add a note to a ticket", async () => {
          const payload: TicketTypes.addNote = {
            ticketId: "ticket123",
            user: { id: "user123" },
            text: "New note",
            date: new Date(),
          };
    
          const noteData = {
            userId: payload.user.id,
            text: payload.text,
            date: expect.any(Date),
            deleted: false,
          };
    
          const ticket = {
            _id: payload.ticketId,
            customerId: "customer123",
            subject: "Test ticket",
            issue: "Test issue",
            ticketType: TicketType.failed_transaction,
            status: Status.open,
            isAssigned: false,
            notes: [noteData],
          };
    
          jest.spyOn(TicketRepository, "addNoteToTicket").mockResolvedValueOnce(ticket as any);
    
          const result = await TicketService.addNote(payload);
    
          expect(TicketRepository.addNoteToTicket).toHaveBeenCalledWith(payload.ticketId, noteData);
          expect(result).toEqual(ticket);
        });
    
        it("should throw an error if unable to add a note", async () => {
          const payload: TicketTypes.addNote = {
            ticketId: "ticket123",
            user: { id: "user123" },
            text: "New note",
            date: new Date(),
          };
    
          jest.spyOn(TicketRepository, "addNoteToTicket").mockResolvedValueOnce(null);
    
          await expect(TicketService.addNote(payload)).resolves.toBeNull();
          expect(TicketRepository.addNoteToTicket).toHaveBeenCalledWith(payload.ticketId, expect.any(Object));
        });
      });
    
      describe("updateNote", () => {
        it("should update a note in a ticket", async () => {
          const payload: TicketTypes.updateNote = {
            ticketId: "ticket123",
            noteId: "note123",
            text: "Updated note",
          };
    
          const noteData = {
            text: payload.text,
          };
    
          const ticket = {
            _id: payload.ticketId,
            customerId: "customer123",
            subject: "Test ticket",
            issue: "Test issue",
            ticketType: "Bug",
            status: "open",
            isAssigned: false,
            notes: [{ id: payload.noteId, text: "Old note", userId: "user123", date: expect.any(Date), deleted: false }],
          };
    
          jest.spyOn(TicketRepository, "updateNoteInTicket").mockResolvedValueOnce(ticket as any);
    
          const result = await TicketService.updateNote(payload);
    
          expect(TicketRepository.updateNoteInTicket).toHaveBeenCalledWith(payload.ticketId, payload.noteId, noteData);
          expect(result).toEqual(ticket);
        });
    
        it("should throw an error if unable to update a note", async () => {
          const payload: TicketTypes.updateNote = {
            ticketId: "ticket123",
            noteId: "note123",
            text: "Updated note",
          };
    
          jest.spyOn(TicketRepository, "updateNoteInTicket").mockResolvedValueOnce(null);
    
          await expect(TicketService.updateNote(payload)).resolves.toBeNull();
          expect(TicketRepository.updateNoteInTicket).toHaveBeenCalledWith(payload.ticketId, payload.noteId, expect.any(Object));
        });
      });
    
      describe("deleteNote", () => {
        it("should delete a note from a ticket", async () => {
          const payload: TicketTypes.deleteNote = {
            ticketId: "ticket123",
            noteId: "note123",
          };
    
          const ticket = {
            _id: payload.ticketId,
            customerId: "customer123",
            subject: "Test ticket",
            issue: "Test issue",
            ticketType: "Bug",
            status: "open",
            isAssigned: false,
            notes: [],
          };
    
          jest.spyOn(TicketRepository, "deleteNoteFromTicket").mockResolvedValueOnce(ticket as any);
    
          const result = await TicketService.deleteNote(payload);
    
          expect(TicketRepository.deleteNoteFromTicket).toHaveBeenCalledWith(payload.ticketId, payload.noteId);
          expect(result).toEqual(ticket);
        });
    
        it("should throw an error if unable to delete a note", async () => {
          const payload: TicketTypes.deleteNote = {
            ticketId: "ticket123",
            noteId: "note123",
          };
    
          jest.spyOn(TicketRepository, "deleteNoteFromTicket").mockResolvedValueOnce(null);
    
          await expect(TicketService.deleteNote(payload)).resolves.toBeNull();
          expect(TicketRepository.deleteNoteFromTicket).toHaveBeenCalledWith(payload.ticketId, payload.noteId);
        });
      });
    
      describe("assignTicket", () => {
        it("should assign a ticket to a support agent", async () => {
          const payload: TicketTypes.assignTicket = {
            ticketId: "ticket123",
            assigneeId: "supportAgent123",
          };
    
          const ticket = {
            _id: payload.ticketId,
            customerId: "customer123",
            subject: "Test ticket",
            issue: "Test issue",
            ticketType: "Bug",
            status: "assigned",
            isAssigned: true,
            assigneeId: payload.assigneeId,
          };
    
          jest.spyOn(TicketRepository, "findTicketById").mockResolvedValueOnce(ticket as any);
          jest.spyOn(TicketRepository, "updateTicket").mockResolvedValueOnce(ticket as any);
          jest.spyOn(userRepository, "findUser").mockResolvedValueOnce({ _id: payload.assigneeId, role: "support-agent" } as any);
    
          const result = await TicketService.assignTicket(payload);
    
          expect(TicketRepository.findTicketById).toHaveBeenCalledWith(payload.ticketId);
          expect(TicketRepository.updateTicket).toHaveBeenCalledWith(payload.ticketId, {
            status: "assigned",
            isAssigned: true,
            assigneeId: payload.assigneeId,
          });
          expect(userRepository.findUser).toHaveBeenCalledWith({_id:payload.assigneeId});
          expect(result).toEqual(ticket);
        });
    
        it("should throw an error if assignee is not a support agent", async () => {
          const payload: TicketTypes.assignTicket = {
            ticketId: "ticket123",
            assigneeId: "supportAgent123",
          };
    
          const ticket = {
            _id: payload.ticketId,
            customerId: "customer123",
            subject: "Test ticket",
            issue: "Test issue",
            ticketType: "Bug",
            status: "open",
            isAssigned: false,
          };
    
          jest.spyOn(TicketRepository, "findTicketById").mockResolvedValueOnce(ticket as any);
          jest.spyOn(userRepository, "findUser").mockResolvedValueOnce({ _id: payload.assigneeId, role: "customer" } as any);
    
          await expect(TicketService.assignTicket(payload)).rejects.toThrow("user is not a support agent");
          expect(TicketRepository.findTicketById).toHaveBeenCalledWith(payload.ticketId);
          expect(userRepository.findUser).toHaveBeenCalledWith({_id:payload.assigneeId});
        });
      });

});
