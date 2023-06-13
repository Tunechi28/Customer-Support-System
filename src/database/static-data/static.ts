import * as bcrypt from "bcryptjs";

export type Role = {
    displayName: string;
};

export const permissionCategories = [
    {
        slug: "admin_permissions",
        displayName: "Admin Permissions",
        description: "For admin related permissions",
    },
    {
        slug: "customer_permissions",
        displayName: "Customer Permissions",
        description: "For customer related permissions",
    },
    {
        slug: "support_agent_permissions",
        displayName: "Support Agent Permissions",
        description: "For support agent related permissions",
    },
    {
        slug: "ticket_permissions",
        displayName: "Ticket Permissions",
        description: "For Ticket related permissions",
    },
];

export type CorePermissionCategory = (typeof permissionCategories)[number]["slug"];

export type UserPermissions = {
    displayName: string
    slug: string
    description: string
    category: string
}

export const adminPermissions: UserPermissions[] = [
    {
        displayName: "View Customers",
        slug: "view_customers",
        description: "Can view all customers",
        category: "admin_permissions",
    },
    {
        displayName: "View Customer",
        slug: "view_customer",
        description: "Can view customer details",
        category: "admin_permissions",
    },
    {
        displayName: "Delete Caustoemr",
        slug: "delete_customer",
        description: "Can delete customer details",
        category: "admin_permissions",
    },
    {
        displayName: "create Support Agent",
        slug: "create-support-agent",
        description: "Can activate user",
        category: "admin_permissions",
    },
    {
        displayName: "View Support Agents",
        slug: "view_support_agent",
        description: "Can view all Support Agents",
        category: "admin_permissions",
    },
    {
        displayName: "View Support Agent",
        slug: "view_support_agent",
        description: "Can view support agent details",
        category: "admin_permissions",
    },
    {
        displayName: "Update Support Ticket",
        slug: "update_support_ticket",
        description: "Can create update ticket",
        category: "support_agent_permissions",
    },
    {
        displayName: "View Support Ticket",
        slug: "view_support_ticket",
        description: "Can view support ticket",
        category: "support_agent_permissions",
    },
    {
        displayName: "View All Support Tickets",
        slug: "create_support_ticket",
        description: "Can view all tickets",
        category: "support_agent_permissions",
    },
    {
        displayName: "Add Note To Support Ticket",
        slug: "add_note_to_support_ticket",
        description: "Can add note to support tickets",
        category: "support_agent_permissions",
    },
    {
        displayName: "Update Note In Support Ticket",
        slug: "update_note_in_support_ticket",
        description: "Can update note in support tickets",
        category: "support_agent_permissions",
    },
    {
        displayName: "Delete Note In Support Ticket",
        slug: "delete_note_in_support_ticket",
        description: "Can delete note in support tickets",
        category: "support_agent_permissions",
    },

];

export const defaultRoles = {
    admin: "admin"
};

export type CoreRole = keyof typeof defaultRoles;

export type CorePermission = (typeof adminPermissions)[number]["slug"];

export type RolePermission = {
    role: CoreRole;
    permissions: CorePermission[];
};


const password = "admin@1234";
const hashedPassword = bcrypt.hashSync(password, 10);

type SeedAdmin = {
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string
    password: string
    role: CoreRole
    
}

export const admins: SeedAdmin[] = [
    {
        firstName: "Henry",
        lastName: "Agbasi",
        email: "tochihenry28@gmail.com",
        phoneNumber: "09133309770",
        password: hashedPassword,
        role: "admin",
    }
];
