import { NextFunction, Response, Request } from "express";
import { authErrors } from "../errors/errorAuth";
import * as authToken from "../../lib/token";
import { getCachedBearerToken } from "../../app/customer/customer-service";
const userType = ["admin","support-agent"];

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const token = extractBearerToken(req.headers.authorization);

    if (!token) {
        return res.status(401).json(authErrors.invalidToken);
    }

    try {
        const customer = await verifyUser(token);

        if (!customer.id) {
            return res.status(401).json(authErrors.invalidToken);
        }

        const cachedBearerToken = await getCachedBearerToken(customer.id);

        if (token === cachedBearerToken) {
            return res.status(401).json(authErrors.invalidToken);
        }

        (req as any).customer = customer;
        return next();
    } catch (error) {
        return res.status(401).json(authErrors.invalidToken);
    }
};

export const authenticateUser = async (req: Request, res: Response, next: NextFunction)=> {
        const token = extractBearerToken(req.headers.authorization);

        if (!token) {
            return res.status(401).json(authErrors.invalidToken);
        }

        try {
            const user = await verifyUser(token);

            if (!user.id || !userType.includes(user.role)) {
                return res.status(401).json(authErrors.invalidToken);
            }

            const cachedBearerToken = await getCachedBearerToken(user.id);;


            if (token === cachedBearerToken) {
                return res.status(401).json(authErrors.invalidToken);
            }

            (req as any).user = user;

            return next();
        } catch (error) {
            return res.status(401).json(authErrors.invalidToken);
        }
    };

export const authenticateUserOrCustomer = async (req: Request, res: Response, next: NextFunction) => {
  const token = extractBearerToken(req.headers.authorization);

  if (!token) {
    return res.status(401).json(authErrors.invalidToken);
  }

  try {
    const user = await verifyUser(token);

    if (!user.id) {
      return res.status(401).json(authErrors.invalidToken);
    }

    const cachedBearerToken = await getCachedBearerToken(user.id);

    if (token === cachedBearerToken) {
      return res.status(401).json(authErrors.invalidToken);
    }

    // Set the user or customer in the request object based on the role
    if (userType.includes(user.role)) {
      (req as any).user = user;
    } else {
      (req as any).customer = user;
    }

    return next();
  } catch (error) {
    return res.status(401).json(authErrors.invalidToken);
  }
};


const extractBearerToken = (authorization: string | undefined) => {
    if (authorization && authorization.startsWith("Bearer ")) {
        return authorization.substring(7);
    }

    return null;
};

const verifyUser = async (token: string) => {
    try {
        return await authToken.verify(token);
    } catch (error) {
        throw new Error("Invalid token");
    }
};
