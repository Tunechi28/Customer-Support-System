export type UserLoginRequest = {
    email: string;
    password: string;
};

export type ChangePasswordPayload = {
    user: any;
    oldPassword: string;
    newPassword: string;
};

export type RequestPasswordResetProps = {
    email: string;
};

export type ResetPasswordProps = RequestPasswordResetProps & {
    token: string;
    password: string;
};

export type ValidatePasswordRequestProps = RequestPasswordResetProps & {
    otp: string;
};

export type CreateUserProps = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    disabled: boolean;
    role: string;
}

export type UpdateUserProps = {
    firstName?: string;
    lastName?: string;
    email?: string;
    disabled?: boolean;
    role?: string;
    params?: any;
}
