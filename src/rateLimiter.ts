import { NextFunction, Request, Response } from "express";

import { loadRules } from "./loadRules";
import { tokenBucket } from "./tokenBucket";
import Queue from "bull";

const rateLimiter = (cacheClient: any, myQueue: Queue.Queue) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const rule = loadRules(req.path);
    const tokenBucketObject = tokenBucket(rule.max, rule.windowMs, cacheClient);
    const key = `${req.ip}:${req.path}`;

    try {
      const canProceed = await tokenBucketObject.consume(key);

      if (!canProceed) {
        if (rule.queue) {
          myQueue.add({
            url: req.url,
            method: req.method,
            headers: req.headers,
            body: req.body,
          });

          res
            .status(429)
            .send(
              "You have been added to a queue. Your request will be processed soon."
            );
        } else {
          res.status(429).send("Too many requests");
        }
      } else {
        next();
      }
    } catch (error) {
      console.error("Redis error", error);
      return next(error);
    }
  };
};
export { rateLimiter };
