import redis from "@redis/redis";

export async function cache<T>(
  key: string,
  ttl: number,
  callback: () => Promise<T>,
): Promise<T> {
  const cached = await redis.get(key);

  if (cached) {
    return JSON.parse(cached);
  }

  const fresh = await callback();

  // Do not cache
  if (fresh !== null && fresh !== undefined) {
    await redis.set(key, JSON.stringify(fresh), {
      EX: ttl,
    });
  }

  return fresh;
}
