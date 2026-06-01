import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { resetCacheClientsForTests } from "./client";
import { inputHash } from "./hash";
import { readSearchBlob, writeSearchBlob } from "./read-write";
import { blobTtlSeconds, isFresh, isStaleButServeable } from "./ttl";
import type { CachedSearchBlob } from "../types";
import {
  inventorySearch,
  inventorySearchById,
  runSearchJob,
} from "../jobs/run-search";

const sampleInput = {
  origin: "JFK",
  destination: "LIS",
  departDate: "2026-06-13",
  adults: 1,
};

function makeBlob(overrides: Partial<CachedSearchBlob> = {}): CachedSearchBlob {
  const now = new Date().toISOString();
  return {
    searchId: "job_test_1",
    kind: "FLIGHTS",
    inputHash: "abc",
    status: "COMPLETE",
    flightOffers: [],
    hotelOffers: [],
    carOffers: [],
    error: null,
    meta: {
      fetchedAt: now,
      ttlSeconds: 900,
      providersAttempted: 1,
      providersSucceeded: 1,
    },
    ...overrides,
  };
}

describe("inventory cache + search flow", () => {
  beforeEach(() => {
    resetCacheClientsForTests();
    delete process.env.REDIS_URL;
    delete process.env.FLIGHTS_SIDECAR_URL;
  });

  afterEach(() => {
    vi.useRealTimers();
    resetCacheClientsForTests();
  });

  it("returns cache miss with STARTED and completes job via mock provider", async () => {
    const hash = inputHash("FLIGHTS", sampleInput);
    const { response, enqueue } = await inventorySearch("FLIGHTS", sampleInput, hash, {
      userId: "user-1",
    });

    expect(response.status).toBe("STARTED");
    expect(response.cacheHit).toBe(false);

    await enqueue();

    const byId = await inventorySearchById(response.searchId);
    expect(byId?.status).toBe("COMPLETE");
    expect(byId?.flightOffers.length).toBeGreaterThan(0);
  });

  it("serves fresh cache hit without re-running provider", async () => {
    const hash = inputHash("FLIGHTS", sampleInput);
    const blob = makeBlob({
      inputHash: hash,
      status: "COMPLETE",
      flightOffers: [
        {
          id: "cached-offer",
          origin: "JFK",
          destination: "LIS",
          departAt: null,
          arriveAt: null,
          durationMinutes: null,
          airline: "Cached Air",
          stops: 0,
          cabin: "ECONOMY",
          price: { amount: 500, currency: "USD" },
          deepLink: null,
          provider: { name: "mock", offerRef: "1" },
          expiresAt: null,
        },
      ],
    });

    await writeSearchBlob("FLIGHTS", hash, blob);

    const { response, enqueue } = await inventorySearch("FLIGHTS", sampleInput, hash, {
      userId: "user-1",
    });

    expect(response.cacheHit).toBe(true);
    expect(response.stale).toBe(false);
    expect(response.status).toBe("COMPLETE");
    expect(response.flightOffers[0]?.airline).toBe("Cached Air");

    await enqueue();
    const reread = await readSearchBlob("FLIGHTS", hash);
    expect(reread?.flightOffers[0]?.airline).toBe("Cached Air");
  });

  it("serves stale blob and flags stale=true", async () => {
    vi.useFakeTimers();
    const fetchedAt = new Date("2026-01-01T00:00:00Z");
    vi.setSystemTime(new Date("2026-01-01T00:20:00Z"));

    const hash = inputHash("FLIGHTS", sampleInput);
    const blob = makeBlob({
      inputHash: hash,
      meta: {
        fetchedAt: fetchedAt.toISOString(),
        ttlSeconds: 900,
        providersAttempted: 1,
        providersSucceeded: 1,
      },
    });

    expect(isFresh(blob.meta.fetchedAt, "FLIGHTS")).toBe(false);
    expect(isStaleButServeable(blob.meta.fetchedAt, "FLIGHTS")).toBe(true);

    await writeSearchBlob("FLIGHTS", hash, blob);

    const { response } = await inventorySearch("FLIGHTS", sampleInput, hash, {
      userId: "user-1",
    });

    expect(response.stale).toBe(true);
    expect(response.cacheHit).toBe(true);
  });

  it("completes mock provider job with offers", async () => {
    const hash = inputHash("FLIGHTS", sampleInput);
    const searchId = "job_failed_test";

    await runSearchJob(searchId, "FLIGHTS", hash, sampleInput);

    const blob = await readSearchBlob("FLIGHTS", hash);
    expect(blob?.status).toBe("COMPLETE");
    expect(blob?.flightOffers.length).toBeGreaterThan(0);
  });

  it("uses kind-specific blob TTL", () => {
    expect(blobTtlSeconds("FLIGHTS")).toBe(45 * 60);
    expect(blobTtlSeconds("HOTELS")).toBe(150 * 60);
  });
});
