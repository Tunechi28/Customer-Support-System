import * as logger from "./logger";
interface HTTPLoggerDTO {
    [unit: string]: any;
}

export const info = (payload:HTTPLoggerDTO) => {
    return logger.info(payload)
}

export const error = (payload:HTTPLoggerDTO) => {
    return logger.info(payload)
}