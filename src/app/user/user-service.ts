import { env, InvalidLoginCredentialError, removeKeysFromObject, SendingEmailUnsuccessful } from "../../utils";
import * as userRepository from "./user-repository";
import { UserLoginRequest, ChangePasswordPayload, RequestPasswordResetProps, CreateUserProps, UpdateUserProps } from "./user-types";
import * as bcrypt from "bcryptjs";
import * as authToken from "../../lib/token";
import * as nanoid from "nanoid";
import { getRedisInstance } from "../../lib/redis";
import { sendEmail } from "../../lib/email";
import { extractBearerToken } from "../../utils/helpers/utils";

const redisClient = getRedisInstance();

const INVALID_RESET_TOKEN = "Invalid reset token";
const PASSWORD_RESET_TOKEN_TTL = 180;

export const validateLoginCredentials = async (payload: UserLoginRequest) => {
    console.log("payload", payload)
    let user = await userRepository.findUser({
        email: payload.email,
    });
    console.log("user", user)

    if (!user) throw new InvalidLoginCredentialError();

console.log("user1/2", user)
    const checker = await bcrypt.compareSync(payload.password, user.password);
    console.log("checker", checker)
    console.log("user2", user)
    if (!checker) throw new InvalidLoginCredentialError();
    console.log("user3", user)
    const data = removeKeysFromObject(user, ["password"]);
    console.log("data", data)
    const token = await createSessionToken(user);

    return { ...data, token };
};

const createSessionToken = async (user: any) => {
    return await authToken.sign({
        id: user._id,
        email: user.email,
        role: user.role,
    });
};

export const changePassword = async (payload: ChangePasswordPayload) => {
    const { oldPassword, newPassword } = payload

    const user = await userRepository.findUser({ _id: payload.user.id });

    if (!user) {
        throw new Error("User not found");
    }

    if (!bcrypt.compareSync(oldPassword, user.password)) {
        throw new Error("password is incorrect");
    }

    if (oldPassword === newPassword) {
        throw new Error("New password cannot be the same as old passwprd");
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await userRepository.updateUser(
        { _id: payload.user.id },
        {
            password: hashedPassword,
        }
    );
};

export const requestPasswordReset = async (props: RequestPasswordResetProps) => {
    const user = await await userRepository.findUser({ email: props.email });
    if (!user) {
        throw new Error("user profile not found");
    }
    const otp = generateOTP();
    console.log("otp", otp);
    await cacheOTP(props.email, otp);
    await sendOTP({ ...props, otp });
};

export const validatePasswordResetRequest = async (props: RequestPasswordResetProps & { otp: string }): Promise<{ token: string }> => {
    const invalidOTPMessage = "Invalid or expired OTP";

    const otp = await getCachedOTP(props.email);

    if (!otp || props.otp !== otp) {
        throw new Error(invalidOTPMessage);
    }

    await deleteOTP(props.email);

    const user = await userRepository.findUser({
        email: props.email,
    });
    if (!user) throw new Error("user profile not found");

    const resetToken = await generateResetToken(props.email);

    return { token: resetToken };
};

export const resetPassword = async (props: RequestPasswordResetProps & { password: string; token: string }): Promise<void> => {
    await validateResetToken(props.email, props.token);
    await deleteResetToken(props.email);
    const user = await userRepository.findUser({
        email: props.email,
    });
    if (!user) throw new Error("user not found");
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(props.password, saltRounds);

    await userRepository.updateUser(
        { _id: user._id },
        {
            password: hashedPassword,
        }
    );
};

const validateResetToken = async (email: string, token: string) => {
    const key = computeTokenCacheKey(email);

    const storedToken = await redisClient.get(key);
    if (token !== storedToken) {
        throw new Error(INVALID_RESET_TOKEN);
    }
};

export const generateResetToken = async (email: string): Promise<string> => {
    const token = nanoid.nanoid();
    const key = computeTokenCacheKey(email);
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

const cacheOTP = async (email: string, otp: string) => {
    const ttl = 180;
    const key = computeOTPCacheKey(email);
    await redisClient.set(key, otp, "EX", ttl);
};

const getCachedOTP = async (email: string) => {
    const key = computeOTPCacheKey(email);
    return await redisClient.get(key);
};

const deleteOTP = async (identifier: string) => {
    const key = computeOTPCacheKey(identifier);
    await redisClient.del(key);
};

const computeOTPCacheKey = (email: string) => {
    return `password-reset:otp:${email}`;
};

const computeTokenCacheKey = (email: string) => {
    return `password-reset:token:${email}`;
};

const sendOTP = async (payload: { email: string; otp: string }) => {
    const email = await sendEmail(payload.email, payload.otp);
    if (email.error) throw new SendingEmailUnsuccessful({ error: email.error });
};

const computeBearerTokenCacheKey = (userId: string) => {
    return `bearer_token:${userId}`;
};

export const getCachedBearerToken = async (userId: string) => {
    const key = computeBearerTokenCacheKey(userId);
    return await redisClient.get(key);
};

const cacheBearerToken = async (userId: string, token: any) => {
    const ttl = env("ACCESS_TOKEN_EXPIRY");
    await redisClient.set(computeBearerTokenCacheKey(userId), token, "PX", ttl);
};

export const userLogout = async (params: any) => {
    const token = extractBearerToken(params.authorization);
    console.log("token", token);
    await cacheBearerToken(params.user.id, token);
};

//create admin
export const createUser = async(params: CreateUserProps) => {
    console.log("params", params)
    const saltRounds = 10;
   params.password = await bcrypt.hash(params.password, saltRounds);
    const user = await userRepository.createUser(params)
    const data = (user as any).toObject()
    delete data.password
    console.log("user", data)
    return user
}

export const updateUser = async(params: UpdateUserProps) => {
    const user = userRepository.updateUser({_id: params.params.userId}, params)
    return user
}

export const getUsers = async(userType?:string ) => {
    let filter = {}
    if(userType) filter = {role: userType}
    console.log("userType", userType)
    const users = await userRepository.findUsers(filter)
    return users
}

export const viewUser = async(userId: string) => {
    console.log("userId", userId)
    const user = await userRepository.findUser({_id : userId})
    const data = removeKeysFromObject(user, ["password"])
    return data
}