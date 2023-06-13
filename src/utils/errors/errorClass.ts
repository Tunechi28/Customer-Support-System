import {
    INTERNAL_SERVER_ERROR,
    SERVICE_UNAVAILABLE_ERROR,
    ACCESS_DENIED_ERROR,
    DUPLICATED_EMAIL_ERROR,
    DUPLICATED_PHONE_ERROR,
    INVALID_EMAIL_ERROR,
    VALIDATION_ERROR,
    INVALID_LOGIN_CREDENTIAL,
    UNAUTHORIZED_ACCESS,
    INVALID_TOKEN,
    SENDING_EMAIL_UNSUCCESSFUL,
    SENDING_SMS_UNSUCCESSFUL,
    USER_ALREADY_EXISTS,
    CUSTOMER_ALREADY_EXISTS
} from "./errorCodes";
import { ErrorProps } from "./errorsInterface";

class BaseError extends Error {
    private httpCode: number;
    private error: any;
    private errorType?: string;

    constructor({ message, httpCode, error, errorType }: ErrorProps) {
        super(message);

        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);

        this.httpCode = httpCode || 500;
        this.error = error;
        this.errorType = errorType || "SERVER_ERROR";
    }
}
export class InternalServerError extends BaseError {
    constructor({ message, error }: Partial<ErrorProps>) {
        super({
            message: message || INTERNAL_SERVER_ERROR.message,
            httpCode: INTERNAL_SERVER_ERROR.code,
            errorType: INTERNAL_SERVER_ERROR.type,
            error,
        });
    }
}
export class ServiceUnavailableError extends BaseError {
    constructor({ message, error }: Partial<ErrorProps>) {
        super({
            message: message || SERVICE_UNAVAILABLE_ERROR.message,
            httpCode: SERVICE_UNAVAILABLE_ERROR.code,
            errorType: SERVICE_UNAVAILABLE_ERROR.type,
            error,
        });
    }
}

export class AccessDeniedError extends BaseError {
    constructor(error: Partial<ErrorProps>) {
        super({
            message: error.message || "Error occured during operation. Please try again later.",
            httpCode: ACCESS_DENIED_ERROR.code,
            errorType: error.errorType || ACCESS_DENIED_ERROR.type,
        });
    }
}

export class UnprocessableEntityError extends BaseError {
    constructor({ message }: Partial<ErrorProps>) {
        super({
            message: message || "Error occured during operation. Please try again later.",
            httpCode: INTERNAL_SERVER_ERROR.code,
            errorType: INTERNAL_SERVER_ERROR.type,
        });
    }
}

export class UserAlreadyExists extends BaseError {
    constructor() {
        const { message, code, type } = USER_ALREADY_EXISTS;
        super({
            message,
            httpCode: code,
            errorType: type,
        });
    }
}

export class CustomerAlreadyExists extends BaseError {
    constructor() {
        const { message, code, type } =  CUSTOMER_ALREADY_EXISTS;
        super({
            message,
            httpCode: code,
            errorType: type,
        });
    }
}

export class DuplicatedEmailError extends BaseError {
    constructor() {
        super({
            message: DUPLICATED_EMAIL_ERROR.message,
            httpCode: DUPLICATED_EMAIL_ERROR.code,
            errorType: DUPLICATED_EMAIL_ERROR.type,
        });
    }
}

export class DuplicatedPhoneError extends BaseError {
    constructor() {
        const { message, code, type } = DUPLICATED_PHONE_ERROR;
        super({
            message,
            httpCode: code,
            errorType: type,
        });
    }
}

export class InvalidEmailError extends BaseError {
    constructor() {
        super({
            message: INVALID_EMAIL_ERROR.message,
            httpCode: INVALID_EMAIL_ERROR.code,
            errorType: INVALID_EMAIL_ERROR.type,
        });
    }
}

export class ValidationError extends BaseError {
    constructor(message: string) {
        super({
            message: message || VALIDATION_ERROR.message,
            httpCode: VALIDATION_ERROR.code,
            errorType: VALIDATION_ERROR.type,
        });
    }
}

export class InvalidLoginCredentialError extends BaseError {
    constructor() {
        super({
            message: INVALID_LOGIN_CREDENTIAL.message,
            httpCode: INVALID_LOGIN_CREDENTIAL.code,
            errorType: INVALID_LOGIN_CREDENTIAL.type,
        });
    }
}

export class UnauthorizedAccessError extends BaseError {
    constructor() {
        super({
            message: UNAUTHORIZED_ACCESS.message,
            httpCode: UNAUTHORIZED_ACCESS.code,
            errorType: UNAUTHORIZED_ACCESS.type,
        });
    }
}

export class InvalidToken extends BaseError {
    constructor() {
        super({
            message: INVALID_TOKEN.message,
            httpCode: INVALID_TOKEN.code,
            errorType: INVALID_TOKEN.type,
        });
    }
}

export class SendingEmailUnsuccessful extends BaseError {
    constructor({ error }: Partial<ErrorProps>) {
        const { message, code, type } = SENDING_EMAIL_UNSUCCESSFUL;
        super({
            message,
            httpCode: code,
            errorType: type,
            error,
        });
    }
}

export class SendingSMSUnsuccessful extends BaseError {
    constructor() {
        const { message, code, type } = SENDING_SMS_UNSUCCESSFUL;
        super({
            message,
            httpCode: code,
            errorType: type,
        });
    }
}
