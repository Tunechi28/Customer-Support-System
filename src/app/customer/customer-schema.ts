import { object, string } from "yup";

export const customerLoginSchema = object({
    body: object({
        password: string().required("password is required"),
        email: string().email().required("email is required"),
    }),
});

export const customerSignupSchema = object({
    body: object({
        password: string().required("password is required"),
        email: string().email().required("email is required"),
        firstName: string().required("firstName is required"),
        lastName: string().required("lastName is required"),
        phoneNumber: string().required("phonenumber is required"),
        companyName: string().optional(),
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
        identifierType: string().required("identifierType is required, it can be email or phone").oneOf(["email", "phone"]),
        identifier: string().required("identifier is required"),
    }),
});

export const validatePasswordResetSchema = object({
    body: object({
        identifierType: string().required("identifierType is required, it can be email or phone").oneOf(["email", "phone"]),
        identifier: string().required("identifier is required"),
        otp: string().required("otp is required"),
    }),
});

export const resetPasswordSchema = object({
    body: object({
        identifierType: string().required("identifierType is required, it can be email or phone").oneOf(["email", "phone"]),
        identifier: string().required("identifier is required"),
        password: string().required("password is required"),
        token: string().required("token is required"),
    }),
});

export const updateProfileSchema = object({
    body: object({
        firstName: string().optional(),
        lastName: string().optional(),
        phoneNumber: string().optional().nullable(),
        country: string().optional().nullable(),
        companyName: string().optional().nullable()
    }),
});

export const deleteProfileSchema = object({
    body: object({
        password: string().required("password is required"),
    }),
});