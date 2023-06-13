import { Schema, model, Document, Types } from "mongoose";

interface IPermissionCategory extends Document {
    id: string;
    slug: string;
    displayName: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

const permissionCategorySchema = new Schema<IPermissionCategory>(
    {
        slug: { type: String, unique: true },
        displayName: { type: String, alias: "display_name" },
        description: String,
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    { collection: "permission_categories" }
);

const PermissionCategory = model<IPermissionCategory>("PermissionCategory", permissionCategorySchema);

export default PermissionCategory
