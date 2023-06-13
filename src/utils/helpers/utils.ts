"use strict";
import { InternalServerError } from "../errors"
import * as logger from "./logger"

export const env = (name: string) => {
    const value = process.env[name];
    if (!value) {
        logger.error(`Missing: process.env['${name}'].`);
        throw new InternalServerError({});
    }
    return value;
}

export const extractBearerToken = (authorization: string | undefined) => {
    if (authorization && authorization.startsWith("Bearer ")) {
      return authorization.substring(7);
    }
  
    return null;
  };

export const isString = <T>(data: any): boolean => {
    return typeof data === 'string' || data instanceof String;
}

export const isLengthy = <T>(data: T[]): boolean => {
    return data && data.length > 0;
}

export const isNotLengthy = <T>(data: T[]): boolean => {
    return !data || data.length <= 0;
}

export const isTruthy = <T>(data: T[]): boolean => {
    return data && data !== undefined;
}

export const isFalsy = <T>(data: T[]): boolean => {
    return !data || data === undefined || data === null;
}

export const isEmpty = <T>(data: any): boolean => {
    return !data || data === undefined || data === null || data === "";
}

export const isNotEmpty = <T>(data: any): boolean => {
    return data !== undefined && data !== null && data !== "";
}

export const objectHasKeys = (data: any) => {
    if (!data || typeof data !== "object") {
        return false;
    }
    return data && Object.keys(data).length > 0;
}

export const objectHasKey = (data: any, key:string) => {
    if (!data || typeof data !== "object") {
        return false;
    }
    return data && data.hasOwnProperty(key);
}

export function removeKeysFromObject<T>(object: T, keys: string[]): T {
    const newObject = {} as T;

    for (const key in { ...object }) {
        if (!keys.includes(key)) {
            newObject[key] = object[key];
        }
    }

    return newObject;
}
