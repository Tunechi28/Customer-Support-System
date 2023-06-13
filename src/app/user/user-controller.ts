import {
    UserLoginRequest,
    ChangePasswordPayload,
    RequestPasswordResetProps,
    ResetPasswordProps,
    ValidatePasswordRequestProps,
    CreateUserProps,
    UpdateUserProps
} from "./user-types";
import * as userService from "./user-service";
import {
    userLoginSchema,
    changePasswordSchema,
    requestPasswordResetSchema,
    resetPasswordSchema,
    validatePasswordResetSchema,
    createUserSchema,
    updateUserSchema
} from "./user-schema";
import validate from "../../utils/middleware/validateSchema";

export const userLogin = async (params: UserLoginRequest) => {
    const payload = await validate(params, userLoginSchema);
    const data = await userService.validateLoginCredentials(payload);
    return { data, message: "login is successful" };
};

export const changePassword = async (params: ChangePasswordPayload) => {
    const payload = await validate(params, changePasswordSchema);
    await userService.changePassword(payload);
    return { message: "password has been changed successfully" };
};

export const requestPasswordReset = async (params: RequestPasswordResetProps) => {
    const payload = await validate(params, requestPasswordResetSchema);
    await userService.requestPasswordReset(payload);
    return { message: "password reset request is sent successfully" };
};

export const validatePasswordResetToken = async (params: ValidatePasswordRequestProps) => {
    const payload = await validate(params, validatePasswordResetSchema);
    const data = await userService.validatePasswordResetRequest(payload);
    return { message: "password reset is valid", data };
};

export const resetPassword = async (params: ResetPasswordProps) => {
    const payload = await validate(params, resetPasswordSchema);
    await userService.resetPassword(payload);
    return { message: "password reset is successfully" };
};

export const userLogout = async (params: any) => {
    await userService.userLogout(params);
    return { message: "logout is successful" };
};

export const createUser = async (params: CreateUserProps) => {
    const payload = await validate(params, createUserSchema);
    const data = await userService.createUser(payload);
    return { message: "User has been created successfully", data };
};

export const getUsers = async (params: any) => {
    const data =  await userService.getUsers(params.query.userType);
    return { message: `All ${params.query.userType? params.query.userType: '' } Users`, data};
};

export const updateUser = async (params: UpdateUserProps) => {
    const payload = await validate(params, updateUserSchema);
    const data = await userService.updateUser(payload);
    return { message: "user updated successfully", data };
};
export const viewUser = async (params: any) => {
    const data =await userService.viewUser(params.params.userId);
    return { message: "user details", data };
};
export const viewUserProfile = async (params) => {
    const data = await userService.viewUser(params.user.id);
    return { message: "user profile details", data };
};

