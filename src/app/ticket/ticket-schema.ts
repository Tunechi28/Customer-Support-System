import { object, string } from "yup";

export const customerLoginSchema = object({
    body: object({
        password: string().required("password is required"),
        email: string().email().required("email is required"),
    }),
});

export const createTicketSchema = object({
    body: object({
        subject: string().required("subject is required"),
        issue: string().required("issue is required"),
        ticketType: string().required("ticketType is required")
    }),
})

export const updateTicketSchema = object({
    body: object({
        subject: string().optional(),
        issue: string().optional(),
        ticketType: string().optional()
    }),
    
})

export const addOrUpdateCommentSchema = object({
    body: object({
        text: string().required("text is required"),
    }),
    
})

export const deleteCommentSchema = object({
    body : object({
        commentId: string().required("commentId is required"),
    })
})

export const addOrUpdateNoteSchema = object({
    body: object({
        text: string().required("text is required"),
    }),
    
})

export const deleteNoteSchema = object({
    body : object({
        noteId: string().required("noteId is required"),
    })
})

export const assignTicketSchema = object({
    body : object({
        assigneeId: string().required("assigneeId is required"),
    })
})

export const setTicketStatusSchema = object({
    body : object({
        status: string().required("status is required"),
    })
})