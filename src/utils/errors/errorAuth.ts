export const authErrors = {
    noAuthorization: {
        message: "No Authorization Key Provided",
        errorType: "NO_AUTHORIZATION_KEY_PROVIDED",
    },
    noToken: {
        message: `Authorization token is required`,
        errorType: "TOKEN_IS_REQUIRED",
    },
    invalidToken: {
        message: `Authorization token is invalid`,
        errorType: "TOKEN_IS_INVALID",
    },
    resourceDenied: { message: "You are not allowed to access this resource" },
};
