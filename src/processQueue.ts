import Queue from "bull";

const processQueue = (myQueue: Queue.Queue) => {
  myQueue.process(async (job, done) => {
    try {
      const { url, method, headers, body } = job.data;

      // Example validations
      if (typeof url !== "string" || url.length === 0) {
        throw new Error("Invalid or missing URL");
      }

      if (!["GET", "POST", "PUT", "DELETE"].includes(method)) {
        throw new Error("Invalid or missing HTTP method");
      }

      // Add additional validations as needed...

      // If everything is valid, proceed to process job...
      console.log("Processing job", job.id);

      done();
    } catch (error) {
      console.error("Job processing error", error);
      done(error as Error);
    }
  });

  myQueue.on("completed", (job) => {
    console.log(`Job completed ${job.id}`);
  });
};

export { processQueue };
