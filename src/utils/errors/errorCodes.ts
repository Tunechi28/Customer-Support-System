export const INTERNAL_SERVER_ERROR = {
    code: 500,
    type: "INTERNAL_SERVER_ERROR",
    message: "Error occured during operation. Please try again later.",
};

export const SERVICE_UNAVAILABLE_ERROR = {
    code: 503,
    type: "SERVICE_UNAVAILABLE_ERROR",
    message: "Service Currently Unavailable",
};

export const ACCESS_DENIED_ERROR = {
    code: 401,
    type: "ACCESS_DENIED_ERROR",
    message: "Unauthorized access",
};

export const TOKEN_ERROR = {
    code: 403,
    type: "TOKEN_ERROR",
    message: "Unauthorized access",
};

export const USER_ALREADY_EXISTS = {
    code: 409,
    type: "USER_ALREADY_EXISTS",
    message: "This user has already been registered",
};

export const CUSTOMER_ALREADY_EXISTS = {
    code: 409,
    type: "USER_ALREADY_EXISTS",
    message: "This customer has already been registered",
};

export const DUPLICATED_EMAIL_ERROR = {
    code: 409,
    type: "DUPLICATED_EMAIL_ERROR",
    message: "This email has already been registered",
};

export const DUPLICATED_PHONE_ERROR = {
    code: 409,
    type: "DUPLICATED_PHONE_ERROR",
    message: "This phone number has already been registered",
};

export const INVALID_EMAIL_ERROR = {
    code: 403,
    type: "INVALID_EMAIL_ERROR",
    message: "Invalid email password combination",
};

export const VALIDATION_ERROR = {
    code: 422,
    type: "VALIDATION_ERROR",
    message: "Validation Error",
};

export const INVALID_LOGIN_CREDENTIAL = {
    code: 403,
    type: "VALIDATION_ERROR",
    message: "Invalid login credential",
};

export const UNAUTHORIZED_ACCESS = {
    code: 401,
    type: "UNAUTHORIZED_ACCESS",
    message: "Unauthorized access",
};

export const INVALID_TOKEN = {
    code: 401,
    type: "INVALID_TOKEN",
    message: "Invalid access token",
};

export const SENDING_EMAIL_UNSUCCESSFUL = {
    code: 422,
    type: "SENDING_EMAIL_UNSUCCESSFUL",
    message: "An error occurred while sending email",
};

export const SENDING_SMS_UNSUCCESSFUL = {
    code: 422,
    type: "SENDING_SMS_UNSUCCESSFUL",
    message: "An error occurred while sending SMS",
};
