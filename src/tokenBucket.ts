function tokenBucket(max: number, windowMs: number, cacheClient: any) {
  return {
    async consume(key: string) {
      const count = (await cacheClient.get(key)) || 0;

      if (count >= max) {
        return false;
      }

      await cacheClient.set(key, Number(count) + 1, "PX", windowMs);

      return true;
    },
  };
}

export { tokenBucket };
