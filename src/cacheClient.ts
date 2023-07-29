import { createClient } from "redis";

const initiateRedisClient = async () => {
  const cacheClient = createClient();
  cacheClient.on("error", (err) => console.log("Redis Client Error", err));
  await cacheClient.connect();

  return cacheClient;
};

export { initiateRedisClient };
