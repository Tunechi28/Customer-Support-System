import { Schema, model, Document } from "mongoose";

interface IComment extends Document{
    userId: string
    text: string
    date: Date
    deleted: boolean
    commentBy: 'customer' | 'admin' | 'support-agent'
}

const  commentsSchema = new Schema<IComment>({
    userId : {type: String},
    date: { type: Date},
    text: { type: String},
    commentBy: {type: String},
    deleted: { type: Boolean, default: false}
  }) 

const Comment= model<IComment>("Comment", commentsSchema);


interface INote extends Document{
    userId: string
    text: string
    date: Date
    deleted: boolean
}

const  notesSchema = new Schema<INote>({
    userId : {type: String},
    date: { type: Date, required: true },
    text: { type: String, required: true },
    deleted: { type: Boolean, default: false, required: true }
  }) 

const Note= model<IComment>("Note", notesSchema);

export {
   Comment, IComment, Note, INote, commentsSchema, notesSchema
}


