import { Schema, model, Document, Types } from "mongoose";

interface IUser {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    disabled: boolean;
    createdAt: Date;
    updatedAt: Date;
    role: string;
}

const userSchema = new Schema<IUser>(
    {
        firstName: { type: String, alias: "first_name" },
        lastName: { type: String, alias: "last_name" },
        email: { type: String, unique: true },
        password: { type: String, select: false },
        disabled: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now, alias: "created_at" },
        updatedAt: { type: Date, default: Date.now, alias: "updated_at" },
        role: { type: String },
    },
    { collection: "users" }
);

const User = model<IUser>("User", userSchema);

export {
    User, IUser
}
