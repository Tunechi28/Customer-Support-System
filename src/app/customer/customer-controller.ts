import * as customerTypes from "./customer-types";
import * as customerService from "./customer-service";
import * as customerSchema from "./customer-schema";
import validate from "../../utils/middleware/validateSchema";

export const customerLogin = async (params: customerTypes.CustomerLoginRequest) => {
    const payload = await validate(params, customerSchema.customerLoginSchema);
    const data = await customerService.validateLoginCredentials(payload);
    return { message: "login is successful", data };
};

export const customerSignup = async (params: customerTypes.CustomerSignupRequest) => {
    const payload = await validate(params, customerSchema.customerSignupSchema);
    const data = await customerService.validateSignupCredentials(payload);
    return { message: "signup is successful", data };
};


export const changePassword = async (params: customerTypes.ChangePasswordPayload) => {
    const payload = await validate(params, customerSchema.changePasswordSchema);
    await customerService.changePassword(payload);
    return { message: "password has been changed successfully" };
};

export const requestPasswordReset = async (params: customerTypes.RequestPasswordResetProps) => {
    const payload = await validate(params, customerSchema.requestPasswordResetSchema);
    await customerService.requestPasswordReset(payload);
    return { message: "password reset request is sent successfully" };
};

export const validatePasswordResetToken = async (params: customerTypes.ValidatePasswordRequestProps) => {
    const payload = await validate(params, customerSchema.validatePasswordResetSchema);
    const data = await customerService.validatePasswordResetRequest(payload);
    return { message: "password reset is valid", data };
};

export const resetPassword = async (params: customerTypes.ResetPasswordProps) => {
    const payload = await validate(params, customerSchema.resetPasswordSchema);
    await customerService.resetPassword(payload);
    return { message: "password reset is successfully" };
};

export const customerLogout = async (params: any) => {
    await customerService.logoutCustomer(params);
    return { message: "logout is successful" };
};

export const updateProfile = async (params: customerTypes.CustomerUpdateRequest) => {
    const payload = await validate(params, customerSchema.updateProfileSchema);
    const data = await customerService.updateProfile(payload);
    return { message: "profile updated successfully", data };
};

export const deleteProfile = async (params: customerTypes.DeleteCustomerRequest) => {
    const payload = await validate(params, customerSchema.deleteProfileSchema);
    const data = await customerService.deleteProfile(payload);
    return { message: "profile deleted successfully", data };
};

export const findProfile = async (params: any) => {
    const data = await customerService.getProfile(params.customer.id);
    return { message: "profile fetched successfully", data };
};