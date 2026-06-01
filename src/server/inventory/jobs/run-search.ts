import type {
  CachedSearchBlob,
  InventoryKind,
  InventorySearchInput,
  InventorySearchResponse,
  JobRecord,
  SearchMeta,
} from "../types";
import { newSearchId } from "../cache/hash";
import {
  acquireRefreshLock,
  deleteSearchBlob,
  readJob,
  readSearchBlob,
  writeJob,
  writeSearchBlob,
} from "../cache/read-write";
import { isFresh, isStaleButServeable, ttlForKind } from "../cache/ttl";
import { getFlightsProvider } from "../providers/flights/fast-flights-sidecar";
import { hotelsStubProvider } from "../providers/hotels/stub";

export interface SearchContext {
  userId: string | null;
  forceRefresh?: boolean;
}

function emptyOffers(kind: InventoryKind): Pick<
  InventorySearchResponse,
  "flightOffers" | "hotelOffers" | "carOffers"
> {
  return {
    flightOffers: kind === "FLIGHTS" ? [] : [],
    hotelOffers: kind === "HOTELS" ? [] : [],
    carOffers: kind === "CARS" ? [] : [],
  };
}

function blobToResponse(blob: CachedSearchBlob, cacheHit: boolean, stale: boolean): InventorySearchResponse {
  return {
    searchId: blob.searchId,
    kind: blob.kind,
    status: blob.status,
    cacheHit,
    stale,
    flightOffers: blob.flightOffers,
    hotelOffers: blob.hotelOffers,
    carOffers: blob.carOffers,
    error: blob.error,
    meta: blob.meta,
  };
}

function createJob(
  searchId: string,
  kind: InventoryKind,
  inputHash: string,
  input: InventorySearchInput
): JobRecord {
  const now = new Date().toISOString();
  return {
    searchId,
    kind,
    inputHash,
    status: "STARTED",
    progress: 0,
    error: null,
    input,
    createdAt: now,
    updatedAt: now,
  };
}

function createStartedBlob(
  searchId: string,
  kind: InventoryKind,
  inputHash: string
): CachedSearchBlob {
  const now = new Date().toISOString();
  const { freshSeconds } = ttlForKind(kind);
  return {
    searchId,
    kind,
    inputHash,
    status: "STARTED",
    flightOffers: [],
    hotelOffers: [],
    carOffers: [],
    error: null,
    meta: {
      fetchedAt: now,
      ttlSeconds: freshSeconds,
      providersAttempted: 0,
      providersSucceeded: 0,
    },
  };
}

export async function runSearchJob(
  searchId: string,
  kind: InventoryKind,
  inputHash: string,
  input: InventorySearchInput
): Promise<void> {
  const now = new Date().toISOString();
  const { freshSeconds } = ttlForKind(kind);

  let providersAttempted = 0;
  let providersSucceeded = 0;
  let flightOffers: CachedSearchBlob["flightOffers"] = [];
  let hotelOffers: CachedSearchBlob["hotelOffers"] = [];
  const carOffers: CachedSearchBlob["carOffers"] = [];
  let error: CachedSearchBlob["error"] = null;
  let status: CachedSearchBlob["status"] = "COMPLETE";

  try {
    if (kind === "FLIGHTS") {
      providersAttempted = 1;
      const provider = getFlightsProvider();
      const raw = await provider.search(input);
      flightOffers = provider.normalize(raw, input);
      providersSucceeded = flightOffers.length > 0 ? 1 : 0;
      status = flightOffers.length > 0 ? "COMPLETE" : "FAILED";
      if (flightOffers.length === 0) {
        error = {
          code: "NO_RESULTS",
          message: "No flight offers returned from provider.",
        };
      }
    } else if (kind === "HOTELS") {
      providersAttempted = 1;
      await hotelsStubProvider.search();
      hotelOffers = hotelsStubProvider.normalize();
      providersSucceeded = 1;
      status = "COMPLETE";
    } else {
      status = "FAILED";
      error = {
        code: "NOT_IMPLEMENTED",
        message: "Car inventory search is not implemented yet.",
      };
    }
  } catch (err) {
    status = "FAILED";
    error = {
      code: "PROVIDER_ERROR",
      message: err instanceof Error ? err.message : "Search failed",
    };
  }

  const meta: SearchMeta = {
    fetchedAt: now,
    ttlSeconds: freshSeconds,
    providersAttempted,
    providersSucceeded,
  };

  const blob: CachedSearchBlob = {
    searchId,
    kind,
    inputHash,
    status,
    flightOffers,
    hotelOffers,
    carOffers,
    error,
    meta,
  };

  await writeSearchBlob(kind, inputHash, blob);

  const job = await readJob(searchId);
  if (job) {
    await writeJob({
      ...job,
      status,
      progress: status === "COMPLETE" ? 100 : status === "FAILED" ? 100 : 50,
      error,
      updatedAt: now,
    });
  }
}

export async function inventorySearch(
  kind: InventoryKind,
  input: InventorySearchInput,
  hash: string,
  ctx: SearchContext
): Promise<{ response: InventorySearchResponse; enqueue: () => Promise<void> }> {
  void ctx.userId;

  if (ctx.forceRefresh) {
    await deleteSearchBlob(kind, hash);
  }

  const cached = ctx.forceRefresh ? null : await readSearchBlob(kind, hash);

  if (cached) {
    const fresh = isFresh(cached.meta.fetchedAt, kind);
    const staleServe = isStaleButServeable(cached.meta.fetchedAt, kind);

    if (fresh || staleServe) {
      const response = blobToResponse(cached, true, !fresh && staleServe);
      const enqueue = async () => {
        if (!fresh && staleServe) {
          const locked = await acquireRefreshLock(kind, hash);
          if (locked) {
            await runSearchJob(cached.searchId, kind, hash, input);
          }
        }
      };
      return { response, enqueue };
    }
  }

  const searchId = cached?.searchId ?? newSearchId();
  const startedBlob = createStartedBlob(searchId, kind, hash);
  await writeSearchBlob(kind, hash, startedBlob);
  await writeJob(createJob(searchId, kind, hash, input));

  const response: InventorySearchResponse = {
    searchId,
    kind,
    status: "STARTED",
    cacheHit: false,
    stale: false,
    ...emptyOffers(kind),
    error: null,
    meta: startedBlob.meta,
  };

  const enqueue = async () => {
    await runSearchJob(searchId, kind, hash, input);
  };

  return { response, enqueue };
}

export async function inventorySearchById(searchId: string): Promise<InventorySearchResponse | null> {
  const job = await readJob(searchId);
  if (!job) return null;

  const blob = await readSearchBlob(job.kind, job.inputHash);
  if (!blob) {
    return {
      searchId,
      kind: job.kind,
      status: job.status,
      cacheHit: false,
      stale: false,
      flightOffers: [],
      hotelOffers: [],
      carOffers: [],
      error: job.error,
      meta: null,
    };
  }

  const fresh = isFresh(blob.meta.fetchedAt, job.kind);
  const staleServe = isStaleButServeable(blob.meta.fetchedAt, job.kind);
  return blobToResponse(blob, true, !fresh && staleServe);
}

export async function refreshInventorySearch(
  searchId: string,
  ctx: SearchContext
): Promise<{ response: InventorySearchResponse; enqueue: () => Promise<void> } | null> {
  const job = await readJob(searchId);
  if (!job) return null;

  return inventorySearch(job.kind, job.input, job.inputHash, {
    ...ctx,
    forceRefresh: true,
  });
}
