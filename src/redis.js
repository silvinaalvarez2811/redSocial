const redis = require("redis");
const redisClient = redis.createClient({
  url: process.env.REDIS_URL ?? "redis://localhost:6379",
  password: process.env.REDIS_PASSWORD ?? "17Sev!JS",
  connectTimeout: 10000,
});

redisClient.on("error", (err) => console.log("Redis Client error", err));
redisClient.on("connect", () => console.log("Redis Client connect OK"));

module.exports = redisClient;