import pino from 'pino'
import dayjs from 'dayjs'
import * as utils from './'

const log = pino({
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true
      }
    },
    base: { pid: false },
    timestamp: () => `,"time":"${dayjs().format()}"`,
  })
export class Log {
    info = (payload: any) => {
        return log.info(payload);
    }

    warn = (payload: any) => {
        return log.warn(payload);
    }

    error = (payload: any) => {
        return log.error(payload);
    }
}
export const info = (payload: any) => {
    return log.info(payload);
}

export const warn = (payload: any) => {
    return log.warn(payload);
}

export const error = (payload: any) => {
    return log.error(payload);
}

export const formatLogObject = (payload: any) => {
    if (!utils.objectHasKeys(payload)) {
        return payload;
    }
    const extractPayload = Object.assign({}, payload);

    for (const [key] of Object.entries(extractPayload)) {
        const flag = /(password|apikey|seckey|token)/i.test(key);
        if (flag) {
            extractPayload[key] = "xxxxxxxxxx";
        }
    }
    return extractPayload;
}
