import IoRedis, { Redis } from "ioredis";

let redis: Redis;

export const initRedis = async (): Promise<void> => {
    redis = new IoRedis((process.env.REDIS_URL as string) || "redis://localhost:6379", { maxRetriesPerRequest: null });
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error("Connection to redis timed out"));
        }, 2000);
        redis.once("connect", () => {
            resolve();
        });
    });
};

initRedis();

export const getRedisInstance = () => {
    if (!redis) {
        throw new Error("Redis not initialized, did you forget to call init");
    }

    return redis;
};

export const getNewRedisInstance = () => {
    return new IoRedis((process.env.REDIS_URL as string) || "redis://localhost:6379", { maxRetriesPerRequest: null });
};
