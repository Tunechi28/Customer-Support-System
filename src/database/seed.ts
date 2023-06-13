import mongoose from "mongoose";
import connectDB from "./index"
import {
  admins,
  defaultRoles,
  permissionCategories,
  adminPermissions,
}  from './static-data/static';


import PermissionCategory from './models/user-model/permission-category.model';
import UserPermission from './models/user-model/user-permission.model';
import { User } from './models/user-model/user.model';
import { UserRole } from './models/user-model/user-role.model';

// Call the connectDB function to establish the connection
connectDB()
  .then(() => {
    // Seeding functions
    async function seedPermissionCategories() {
      try {
        await PermissionCategory.deleteMany({});

        for (const category of permissionCategories) {
          await PermissionCategory.create(category);
        }

        console.log("Finished seeding permission categories");
      } catch (error) {
        console.error("Error seeding permission categories:", error);
      }
    }

    async function seedRoles() {
      try {
        await UserRole.deleteMany({});

        for (const roleKey of Object.keys(defaultRoles)) {
          const role = defaultRoles[roleKey];
          await UserRole.findOneAndUpdate(
            { name: role },
            { name: role, permissions: [] },
            { upsert: true }
          );
        }

        console.log("Finished seeding roles");
      } catch (error) {
        console.error("Error seeding roles:", error);
      }
    }

    async function seedAdmins() {
      try {
        await User.deleteMany({});

        for (const admin of admins) {
          await User.findOneAndUpdate(
            { email: admin.email, role: defaultRoles.admin },
            {
              firstName: admin.firstName,
              lastName: admin.lastName,
              email: admin.email,
              phoneNumber: admin.phoneNumber,
              password: admin.password,
              role: defaultRoles.admin,
            },
            { upsert: true }
          );
        }

        console.log("Finished seeding admins");
      } catch (error) {
        console.error("Error seeding admins:", error);
      }
    }

    async function seedAdminPermissions() {
      try {
        await UserPermission.deleteMany({});

        for (const permission of adminPermissions) {
          await UserPermission.findOneAndUpdate(
            { slug: permission.slug.toLowerCase() },
            {
              slug: permission.slug.toLowerCase(),
              displayName: permission.displayName,
              description: permission.description,
              categorySlug: permission.category,
            },
            { upsert: true }
          );
        }

        console.log("Finished seeding admin permissions");
      } catch (error) {
        console.error("Error seeding admin permissions:", error);
      }
    }

    async function main() {
      await seedPermissionCategories();
      await seedRoles();
      await seedAdmins();
      await seedAdminPermissions();

      // Close the MongoDB connection after seeding
      mongoose.connection.close();
    }

    main().catch((error) => {
      console.error("Error seeding data:", error);
    });
  })
  .catch((error) => {
    console.log("Failed to connect to database", error);
  });
