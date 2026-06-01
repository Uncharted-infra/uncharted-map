import type { InventoryKind } from "../types";

export function searchBlobKey(kind: InventoryKind, inputHash: string): string {
  return `search:v1:${kind.toLowerCase()}:${inputHash}`;
}

export function jobKey(searchId: string): string {
  return `job:${searchId}`;
}

export function offerKey(kind: InventoryKind, offerId: string): string {
  return `offer:v1:${kind.toLowerCase()}:${offerId}`;
}

export function refreshLockKey(kind: InventoryKind, inputHash: string): string {
  return `lock:refresh:${kind.toLowerCase()}:${inputHash}`;
}

export function rateLimitKey(userId: string, provider: string): string {
  return `rl:user:${userId}:${provider}`;
}
