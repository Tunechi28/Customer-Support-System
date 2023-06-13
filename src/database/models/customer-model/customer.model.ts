import { Schema, model, Document } from "mongoose";

interface ICustomer {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    companyName: string;
    phoneNumber: string;
    password: string;
    disabled: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const  customerSchema = new Schema<ICustomer>(
    {
        firstName: { type: String, alias: "first_name" },
        lastName: { type: String, alias: "last_name" },
        email: { type: String, unique: true },
        phoneNumber: { type: String, unique: true, alias: "phone_number" },
        companyName: {type: String, alias: "company_name"},
        password: { type: String, select: false },  
        disabled: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now, alias: "created_at" },
        updatedAt: { type: Date, default: Date.now, alias: "updated_at" },
    },
    { collection: "customers" }
);

const Customer= model<ICustomer>("Customer", customerSchema);

export {
    Customer, ICustomer
}
