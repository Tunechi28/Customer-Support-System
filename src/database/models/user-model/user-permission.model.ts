import { Schema, model, Document, Types } from "mongoose";

interface IUserPermission extends Document {
    id: string;
    slug: string;
    displayName: string;
    description: string;
    category: Types.ObjectId;
    categorySlug: string;
    createdAt: Date;
    updatedAt: Date;
}

const userPermissionSchema = new Schema<IUserPermission>(
    {
        slug: { type: String, unique: true },
        displayName: { type: String, alias: "display_name" },
        description: String,
        category: { type: Schema.Types.ObjectId, ref: "PermissionCategory" },
        categorySlug: { type: String, alias: "category_slug" },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    { collection: "user_permissions" }
);

const UserPermission = model<IUserPermission>("UserPermission", userPermissionSchema);

export default UserPermission
