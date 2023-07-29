# Rate Limiter Middleware using Express and Node.js

This project is a rate limiting middleware for Express.js applications. It is designed to limit the number of requests that a client can make to an API within a certain timeframe. This is useful for protecting your application from potential DOS (Denial of Service) attacks.

## Features

1. **Token Bucket Algorithm:** The middleware uses the token bucket algorithm, which allows for a flexible rate limiting scheme. This allows for a burst of requests up to a maximum limit, while still maintaining an average number of requests over time.
2. **Rule-Based:** The middleware uses a set of rules defined in JSON files. These rules allow for different rate limits for different routes.
3. **Queuing:** When a client exceeds the rate limit, the middleware has an option to queue the additional requests and process them once the client is again below the rate limit.

## Architecture

![Alt text](rateLimiter.drawio.png?raw=true)

**Explination**

1. **Client Sends a Request:** The client, typically a browser or another server, sends an HTTP request to the server.

2. **Request Received by Server:** The server, which listens on a specific port (e.g., 3000), receives the incoming HTTP request.

3. **Express Middleware (Rate Limiter) Processing:** The Express server processes incoming requests by passing them through the middleware functions that you've defined. The rate limiter middleware is the first to process the request.

4. **Rate Limiter Reads Rules from Disk:** Before interacting with Redis, the middleware reads rate limiting rules from a file on disk. These rules are specific to each route and they specify the maximum number of requests allowed per certain period, and whether requests should be queued if the rate limit is exceeded.

5. **Rate Limiter Caches Rules in Memory:** To improve performance, the middleware caches the rate limiting rules in memory after reading them from disk. This means that for subsequent requests, the middleware can skip the disk reading step and fetch the rules directly from memory.

6. **Rate Limiter Interacts with Redis:** The middleware interacts with Redis to get the current count of requests from this specific client IP and increment it.

7. **Rate Limiting Check:** The middleware checks if the client has exceeded their limit of allowed requests per certain period.

   - If the client has exceeded the rate limit and the queue option for this route is false, the middleware immediately sends a response to the client with a 429 status code (Too Many Requests), and the request does not proceed to any further middleware or route handlers.

   - If the client has exceeded the rate limit and the queue option for this route is true, the middleware queues the request and waits until it can be processed.

   - If the client has not exceeded the rate limit, the middleware calls next(), which passes the request on to the next middleware or route handler.

8. **Express Route Handler Processing:** After the rate limiter middleware, the Express server passes the request to the appropriate route handler, based on the path and HTTP method of the request.

## Requirements

- Node.js v14.0.0 or above
- Redis: as a fast and efficient in-memory data store to keep track of the number of requests.

## Setup & Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-repository/rate-limiter.git
   cd rate-limiter
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Install and start Redis**

   Reference: https://redis.io/docs/getting-started/installation/

4. **Set Rules**

   You can play arround with `rules.json` and introduce more rules.

5. **Start the server**

   ```bash
   npm run dev
   ```

6. **Make HTTP request**

   ```bash
   curl http://localhost:3000
   ```
