import { createHash } from "crypto";

import type { InventoryKind, InventorySearchInput } from "../types";

function normalizeCabin(cabin: InventorySearchInput["cabin"]): string | null {
  return cabin ?? null;
}

export function canonicalSearchPayload(
  kind: InventoryKind,
  input: InventorySearchInput
): Record<string, unknown> {
  return {
    kind,
    origin: input.origin.trim().toUpperCase(),
    destination: input.destination.trim().toUpperCase(),
    departDate: input.departDate.trim(),
    returnDate: input.returnDate?.trim() || null,
    adults: input.adults,
    children: input.children ?? 0,
    cabin: normalizeCabin(input.cabin),
  };
}

export function inputHash(kind: InventoryKind, input: InventorySearchInput): string {
  const canonical = canonicalSearchPayload(kind, input);
  const json = JSON.stringify(canonical, Object.keys(canonical).sort());
  return createHash("sha256").update(json).digest("hex");
}

export function newSearchId(): string {
  return `job_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}
