export type CustomerLoginRequest = {
    email: string;
    password: string;
};


export type CustomerSignupRequest = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    companyName: string;
};

export type CustomerUpdateRequest = {
    id?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    companyName?: string;
    customer: any;
};

export type ChangePasswordPayload = {
    customer: any;
    oldPassword: string;
    newPassword: string;
};

export type RequestPasswordResetProps = {
    identifierType: string;
    identifier: string;
};

export type ResetPasswordProps = RequestPasswordResetProps & {
    token: string;
    password: string;
};

export type ValidatePasswordRequestProps = RequestPasswordResetProps & {
    otp: string;
};

export type DeleteCustomerRequest = {
    id: string;
    password: string;
};
