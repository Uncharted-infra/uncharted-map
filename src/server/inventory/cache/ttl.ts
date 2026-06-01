import type { InventoryKind } from "../types";

export interface TtlPolicy {
  freshSeconds: number;
  staleServeSeconds: number;
}

const TTL_BY_KIND: Record<InventoryKind, TtlPolicy> = {
  FLIGHTS: { freshSeconds: 15 * 60, staleServeSeconds: 30 * 60 },
  HOTELS: { freshSeconds: 30 * 60, staleServeSeconds: 2 * 60 * 60 },
  CARS: { freshSeconds: 30 * 60, staleServeSeconds: 2 * 60 * 60 },
};

export const JOB_TTL_SECONDS = 60 * 60;
export const OFFER_TTL_SECONDS = 24 * 60 * 60;
export const REFRESH_LOCK_SECONDS = 30;

export function ttlForKind(kind: InventoryKind): TtlPolicy {
  return TTL_BY_KIND[kind];
}

export function blobTtlSeconds(kind: InventoryKind): number {
  const { freshSeconds, staleServeSeconds } = ttlForKind(kind);
  return freshSeconds + staleServeSeconds;
}

export function isFresh(fetchedAt: string, kind: InventoryKind, now = Date.now()): boolean {
  const { freshSeconds } = ttlForKind(kind);
  return now - Date.parse(fetchedAt) < freshSeconds * 1000;
}

export function isStaleButServeable(
  fetchedAt: string,
  kind: InventoryKind,
  now = Date.now()
): boolean {
  const { freshSeconds, staleServeSeconds } = ttlForKind(kind);
  const ageMs = now - Date.parse(fetchedAt);
  return ageMs >= freshSeconds * 1000 && ageMs < (freshSeconds + staleServeSeconds) * 1000;
}
