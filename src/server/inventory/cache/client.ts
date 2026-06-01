import Redis from "ioredis";

export interface CacheClient {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttlSeconds?: number): Promise<void>;
  setNx(key: string, value: string, ttlSeconds: number): Promise<boolean>;
  del(key: string): Promise<void>;
}

class MemoryCacheClient implements CacheClient {
  private store = new Map<string, { value: string; expiresAt: number | null }>();

  async get(key: string): Promise<string | null> {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (entry.expiresAt !== null && Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.value;
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    const expiresAt =
      ttlSeconds !== undefined ? Date.now() + ttlSeconds * 1000 : null;
    this.store.set(key, { value, expiresAt });
  }

  async setNx(key: string, value: string, ttlSeconds: number): Promise<boolean> {
    const existing = await this.get(key);
    if (existing !== null) return false;
    await this.set(key, value, ttlSeconds);
    return true;
  }

  async del(key: string): Promise<void> {
    this.store.delete(key);
  }
}

let redisClient: Redis | null = null;
let memoryClient: MemoryCacheClient | null = null;

function getRedisUrl(): string | undefined {
  return process.env.REDIS_URL?.trim() || undefined;
}

export function useMemoryCache(): boolean {
  return !getRedisUrl();
}

export function getCacheClient(): CacheClient {
  const url = getRedisUrl();
  if (!url) {
    if (!memoryClient) {
      memoryClient = new MemoryCacheClient();
    }
    return memoryClient;
  }

  if (!redisClient) {
    redisClient = new Redis(url, {
      maxRetriesPerRequest: 2,
      lazyConnect: true,
    });
  }

  return {
    async get(key: string) {
      return redisClient!.get(key);
    },
    async set(key: string, value: string, ttlSeconds?: number) {
      if (ttlSeconds !== undefined) {
        await redisClient!.set(key, value, "EX", ttlSeconds);
      } else {
        await redisClient!.set(key, value);
      }
    },
    async setNx(key: string, value: string, ttlSeconds: number) {
      const result = await redisClient!.set(key, value, "EX", ttlSeconds, "NX");
      return result === "OK";
    },
    async del(key: string) {
      await redisClient!.del(key);
    },
  };
}

/** Reset clients — for tests only. */
export function resetCacheClientsForTests(): void {
  redisClient?.disconnect();
  redisClient = null;
  memoryClient = null;
}

export async function connectCacheIfNeeded(): Promise<void> {
  const url = getRedisUrl();
  if (url && redisClient) {
    if (redisClient.status === "wait") {
      await redisClient.connect();
    }
  }
}
