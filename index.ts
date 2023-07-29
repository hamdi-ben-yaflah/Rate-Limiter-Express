import express from "express";
import { rateLimiter } from "./src/rateLimiter";
import { RedisClientType, createClient } from "redis";
import { initiateRedisClient } from "./src/cacheClient";
import Queue from "bull";
import { processQueue } from "./src/processQueue";

async function startServer() {
  const redisClient = await initiateRedisClient();
  const myQueue = new Queue("myQueue");
  processQueue(myQueue);

  const app = express();

  app.use(rateLimiter(redisClient, myQueue));

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  app.get("/api", (req, res) => {
    res.send("API endpoint!");
  });

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

startServer().catch((err) => {
  console.error("Failed to start server", err);
});
