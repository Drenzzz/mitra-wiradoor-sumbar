import { LRUCache } from "lru-cache";

type RateLimitOptions = {
  uniqueTokenPerInterval?: number;
  interval?: number;
};

export function rateLimit(options?: RateLimitOptions) {
  const tokenCache = new LRUCache<string, number>({
    max: options?.uniqueTokenPerInterval || 500,
    ttl: options?.interval || 60000,
  });

  return {
    check: (token: string, limit: number) => {
      const tokenCount = tokenCache.get(token) || 0;
      const currentUsage = tokenCount + 1;

      tokenCache.set(token, currentUsage);

      return currentUsage <= limit;
    },
  };
}

export const globalLimiter = rateLimit({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 500,
});
