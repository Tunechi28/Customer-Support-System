import { Schema, model, Document, Types } from "mongoose";

interface IUserRole extends Document {
    id: string;
    name: string;
    description?: string;
    permissions: Record<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
    isCustom: boolean;
  }
  
  const userRoleSchema = new Schema<IUserRole>({
    name: { type: String, unique: true },
    description: String,
    permissions: Schema.Types.Mixed,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    isCustom: { type: Boolean, default: false },
  }, { collection: "user_roles" });
  
  const UserRole = model<IUserRole>("UserRole", userRoleSchema);
  

  export {
    UserRole,
    IUserRole
  }