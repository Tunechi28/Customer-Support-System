import { AnySchema } from "yup";
import { ValidationError } from "../errors";

const validate = async <T>(payload: T, schema: AnySchema) => {
    try {
        await schema.validate({ body: payload });
        return payload;
    } catch (error: any) {
        throw new ValidationError(error.errors.toString());
    }
};

export default validate;