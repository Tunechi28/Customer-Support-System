import jwt from "jsonwebtoken";
import { env, UnauthorizedAccessError } from "../utils";

const tokenKey =env("NODE_KEY");

type UserClaims = {
    id: string;
    email: string;
    role?: string;
}

export const sign = async (userClaims: UserClaims) => {
    const token = jwt.sign(userClaims, tokenKey, { expiresIn: env("ACCESS_TOKEN_EXPIRY") });
    return token;
};

//todo - rework this
export const verify = (token: string | undefined) => {
    if (!token) throw new UnauthorizedAccessError();

    try {
        const decoded = jwt.verify(token, tokenKey);
        return decoded;
    } catch (err) {
        return err;
    }
};
