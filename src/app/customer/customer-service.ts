import {
    InvalidLoginCredentialError,
    removeKeysFromObject,
    SendingEmailUnsuccessful,
    SendingSMSUnsuccessful,
    CustomerAlreadyExists,
    env,
} from "../../utils";
import * as customerRepository from "./customer-repository";
import * as customerTypes from "./customer-types";
import * as bcrypt from "bcryptjs";
import * as authToken from "../../lib/token";
import { getRedisInstance } from "../../lib/redis";
import * as nanoid from "nanoid";
import { sendSMS } from "../../lib/sms";
import { sendEmail } from "../../lib/email";
import { extractBearerToken } from "../../utils";
import { ICustomer } from "../../database/models/customer-model/customer.model";

const redisClient = getRedisInstance();

const INVALID_RESET_TOKEN = "Invalid reset token";
const PASSWORD_RESET_TOKEN_TTL = 180;

export const validateLoginCredentials = async (payload: customerTypes.CustomerLoginRequest) => {
    const customer = await customerRepository.findCustomer({
        email: payload.email,
    });

    if (!customer) throw new InvalidLoginCredentialError();
    const checker = await bcrypt.compareSync(payload.password, customer.password);
    if (!checker) throw new InvalidLoginCredentialError();

    const data = removeKeysFromObject(customer, ["password"]);
    const token = await createSessionToken(data);
    return { ...data, token };
};
export const createSessionToken = async (customer: any) => {
    return await authToken.sign({
        id: customer._id,
        email: customer.email,
    });
};

export const validateSignupCredentials = async (payload: customerTypes.CustomerSignupRequest) => {
    const {
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
        companyName
    } = payload;

    const customer = await customerRepository.findCustomerWithFilters({ email }, { phoneNumber });
    if (customer) throw new CustomerAlreadyExists();

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newCustomer = await customerRepository.createCustomer({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phoneNumber,
        companyName
    });

    const data = (newCustomer as any).toObject();
    delete data.password;
    const token = await createSessionToken(newCustomer);

    return { ...data, token };
};


export const changePassword = async (payload: customerTypes.ChangePasswordPayload) => {
    const { oldPassword, newPassword} = payload;

    const customer = await customerRepository.findCustomer({ _id: payload.customer.id });
    if (!customer) {
        throw new Error("Customer not found");
    }
    if (!customer.password) {
        throw new Error("password not set");
    }

    if (!bcrypt.compareSync(oldPassword, customer.password)) {
        throw new Error("password is incorrect");
    }

    if (oldPassword === newPassword) {
        throw new Error("New password cannot be the same as old passwprd");
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await customerRepository.updateCustomer(
        { _id: payload.customer.id },
        {
            password: hashedPassword,
        }
    );
};

export const requestPasswordReset = async (props: customerTypes.RequestPasswordResetProps) => {
    const customer = await getCustomer(props);
    if (!customer) {
        throw new Error("Customer not found");
    }
    const otp = generateOTP();
    await cacheOTP(props.identifier, otp);
    await sendOTP({ ...props, otp });
};

export const validatePasswordResetRequest = async (
    props: customerTypes.RequestPasswordResetProps & { otp: string }
): Promise<{ token: string }> => {
    const invalidOTPMessage = "Invalid or expired OTP";

    const otp = await getCachedOTP(props.identifier);

    if (!otp || props.otp !== otp) {
        throw new Error(invalidOTPMessage);
    }

    await deleteOTP(props.identifier);

    const customer = await getCustomer(props);
    if (!customer) throw new Error("Customer not found");

    const resetToken = await generateResetToken(props.identifier);

    return { token: resetToken };
};

export const resetPassword = async (props: customerTypes.RequestPasswordResetProps & { password: string; token: string }): Promise<void> => {
    await validateResetToken(props.identifier, props.token);
    await deleteResetToken(props.identifier);
    const customer = await getCustomer(props);
    if (!customer) throw new Error("customer not found");
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(props.password, saltRounds);

    await customerRepository.updateCustomer(
        { _id: customer._id },
        {
            password: hashedPassword,
        }
    );
};

export const validateResetToken = async (identifier: string, token: string) => {
    const key = computeTokenCacheKey(identifier);

    const storedToken = await redisClient.get(key);
    if (token !== storedToken) {
        throw new Error(INVALID_RESET_TOKEN);
    }
};

export const generateResetToken = async (identifier: string): Promise<string> => {
    const token = nanoid.nanoid();
    const key = computeTokenCacheKey(identifier);
    await redisClient.set(key, token, "EX", PASSWORD_RESET_TOKEN_TTL);
    return token;
};

export const deleteResetToken = async (identifier: string) => {
    const key = computeTokenCacheKey(identifier);
    await redisClient.del(key);
};

const generateOTP = () => {
    return nanoid.customAlphabet("1234567890")(6);
};

const cacheOTP = async (identifier: string, otp: string) => {
    const ttl = 180;
    const key = computeOTPCacheKey(identifier);
    await redisClient.set(key, otp, "EX", ttl);
};

const getCachedOTP = async (identifier: string) => {
    const key = computeOTPCacheKey(identifier);
    return await redisClient.get(key);
};

const deleteOTP = async (identifier: string) => {
    const key = computeOTPCacheKey(identifier);
    await redisClient.del(key);
};

const computeOTPCacheKey = (identifier: string) => {
    return `password-reset:otp:${identifier}`;
};

const computeTokenCacheKey = (identifier: string) => {
    return `password-reset:token:${identifier}`;
};

const getCustomer = async (props: any): Promise<ICustomer | null> => {
    switch (props.identifierType) {
        case "phone":
            return await customerRepository.findCustomer({ phoneNumber: props.identifier });
        case "email":
            return await customerRepository.findCustomer({ email: props.identifier });
        default:
            throw new Error("Invalid identifier provided");
    }
};

const sendOTP = async (payload: { identifierType: string; identifier: string; otp: string }) => {
    switch (payload.identifierType) {
        case "phone": {
            const sms = await sendSMS(payload.identifier, payload.otp);
            if (sms.error) throw new SendingSMSUnsuccessful();
            break;
        }
        case "email": {
            const email = await sendEmail(payload.identifier, payload.otp);
            if (email.error) throw new SendingEmailUnsuccessful({ error: email.error });
            break;
        }
        default:
            throw new Error("This identifier type is currently not supported");
    }
};

const computeBearerTokenCacheKey = (customerId: string) => {
    return `bearer_token:${customerId}`;
};

export const getCachedBearerToken = async (customerId: string) => {
    const key = computeBearerTokenCacheKey(customerId);
    return await redisClient.get(key);
};

const cacheBearerToken = async (customerId: string, token: any) => {
    const ttl = env("ACCESS_TOKEN_EXPIRY");
    await redisClient.set(computeBearerTokenCacheKey(customerId), token, "PX", ttl);
};

export const logoutCustomer = async (params: any) => {
    const token = extractBearerToken(params.authorization);
    cacheBearerToken(params.customer.id, token);
};

export const deleteProfile = async (params: customerTypes.DeleteCustomerRequest) => {
    const customer = await customerRepository.findCustomer({ _id: params.id });
    if (!customer) {
        throw new Error("Customer not found");
    }

    const checker = await bcrypt.compareSync(params.password, customer.password as string);
    if (!checker) throw new Error("Wrong password");
    await customerRepository.deleteCustomer({ _id: params.id });
};

export const updateProfile = async (params: customerTypes.CustomerUpdateRequest) => {
    let customer = await customerRepository.findCustomer({ _id: params.customer.id });
    if (!customer) throw new Error("Customer not found");
    customer = await customerRepository.updateCustomer(
        { _id: params.customer.id },
        {
            ...params
        }
    );
    return customer;
};

export const getProfile = async (id: string) => {
    const customer = await customerRepository.findCustomer({ _id : id});
    if (!customer) throw new Error("Customer not found");
    return customer;
};