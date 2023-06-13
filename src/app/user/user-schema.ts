import { object, string } from "yup";

export const userLoginSchema = object({
    body: object({
        password: string().required("password is required"),
        email: string().email().required("email is required"),
    }),
});

export const changePasswordSchema = object({
    body: object({
        oldPassword: string().required("oldPassword is required"),
        newPassword: string().required("newPassword is required"),
    }),
});

export const requestPasswordResetSchema = object({
    body: object({
        email: string().required("email is required"),
    }),
});

export const validatePasswordResetSchema = object({
    body: object({
        email: string().required("email is required"),
        otp: string().required("otp is required"),
    }),
});

export const resetPasswordSchema = object({
    body: object({
        email: string().required("email is required"),
        password: string().required("password is required"),
        token: string().required("token is required"),
    }),
});

export const createUserSchema = object({
    body: object({
        firstName: string().required("firstName is required"),
        lastName: string().required("lastName is required"),
        email: string().email().required("email is required"),
        password: string().required("password is required"),
        role: string().required("role is required")
    }),
});

export const updateUserSchema = object({
    body: object({
        firstName: string().optional(),
        lastName: string().optional(),
        email: string().email().optional(),
        password: string().optional(),
        role: string().optional()
    }),
});
