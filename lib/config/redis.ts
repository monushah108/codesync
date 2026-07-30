import Redis from "ioredis";

const UPSTASH_REDIS_URL = process.env.REDIS_URL as string;

export const redis = new Redis(UPSTASH_REDIS_URL);

redis.on("connect", () => {
  console.log("✅ Connected to Redis");
});

redis.on("error", (err) => {
  console.error("❌ Redis Error:", err);
});

export const pubClient = new Redis(UPSTASH_REDIS_URL);

export const subClient = pubClient.duplicate();
