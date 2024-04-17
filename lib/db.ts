import { PrismaClient } from "@prisma/client";
import { createClient } from "redis";

type ValueType<T> = T extends Promise<infer U> ? U : T;

const prismaClientSingleton = () => {
  return new PrismaClient();
};

const redisClientSignleton = () => {
  const client = createClient({
    url: process.env.REDIS_URL,
    connectTimeout: 10000, // in 10secs
  });
  client
    .connect()
    .then(() => {
      console.log("Redis client connected...");
    })
    .catch((err) => {
      console.log("Redis client not connected: ", err);
    });
  return client;
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
  var redis: undefined | ValueType<ReturnType<typeof redisClientSignleton>>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();
const redis = globalThis.redis ?? redisClientSignleton();

export { prisma, redis };

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
  globalThis.redis = redis;

  redis.on("error", (error) => {
    console.error(`Redis client error:`, error);
  });
}
