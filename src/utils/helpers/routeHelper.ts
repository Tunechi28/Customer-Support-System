import { UnprocessableEntityError } from "../errors";
import { Request, Response, Router } from "express";
import { formatLogObject } from "./logger";
import { isEmpty } from "./utils";
import * as log from "./apiLog";

interface APIRequest extends Request {
    files?: any;
}
interface routeDTO {
    req: APIRequest;
    res: Response;
    controller: Function;
    shouldLogger?: boolean;
    include?: string[];
}

export async function routeHelper({ req, res, controller, shouldLogger = false, include }: routeDTO): Promise<any> {
    try {
        if (typeof req.body !== "undefined" && Array.isArray(req.body)) {
            throw new UnprocessableEntityError({ message: "Request body must be of type object" });
        }
        const payload = Object.assign(
            {},
            req.body,
            { file: (req as any).file },
            { params: req.params },
            { query: req.query },
            {user: (req as any).user},
            {customer: (req as any).customer},
            { authorization: req.headers.authorization },
        );
        const { data, message } = await controller(include ? refineProps(req, include, payload) : payload);

        if (shouldLogger) {
            log.info({
                message,
                data: formatLogObject(payload),
                httpPath: req.path,
                httpMethod: req.method,
                function: controller.name,
            });
        }

        return res.json({ status: true, message, data: data || {} || [] });
    } catch (error: any) {
        log.error({
            message: error.message,
            error,
            httpPath: req.path,
            httpMethod: req.method,
            function: controller.name,
        });

        return res.status(error.httpCode || 400).json({
            status: false,
            error: error.message,
            errorType: error.errorType,
            errors: error.error,
        });
    }
}

export const APIRouter = (): Router => Router();

const refineProps = (req: any, props: string[], payload: any) => {
    const refinedPayload: any = { params: payload };

    for (const prop of props) {
        const propValue = req[prop];

        if (!propValue || isEmpty(propValue)) {
            log.error({ message: `${prop} must not be undefined` });
            continue;
        }

        refinedPayload[prop] = propValue;
    }

    return refinedPayload;
};