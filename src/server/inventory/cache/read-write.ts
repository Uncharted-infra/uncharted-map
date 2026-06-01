import type { CachedSearchBlob, InventoryKind, JobRecord } from "../types";
import { getCacheClient } from "./client";
import { jobKey, refreshLockKey, searchBlobKey } from "./keys";
import { blobTtlSeconds, JOB_TTL_SECONDS, REFRESH_LOCK_SECONDS } from "./ttl";

export async function readSearchBlob(
  kind: InventoryKind,
  inputHash: string
): Promise<CachedSearchBlob | null> {
  const raw = await getCacheClient().get(searchBlobKey(kind, inputHash));
  if (!raw) return null;
  return JSON.parse(raw) as CachedSearchBlob;
}

export async function writeSearchBlob(
  kind: InventoryKind,
  inputHash: string,
  blob: CachedSearchBlob
): Promise<void> {
  await getCacheClient().set(
    searchBlobKey(kind, inputHash),
    JSON.stringify(blob),
    blobTtlSeconds(kind)
  );
}

export async function readJob(searchId: string): Promise<JobRecord | null> {
  const raw = await getCacheClient().get(jobKey(searchId));
  if (!raw) return null;
  return JSON.parse(raw) as JobRecord;
}

export async function writeJob(job: JobRecord): Promise<void> {
  await getCacheClient().set(jobKey(job.searchId), JSON.stringify(job), JOB_TTL_SECONDS);
}

export async function acquireRefreshLock(
  kind: InventoryKind,
  inputHash: string
): Promise<boolean> {
  return getCacheClient().setNx(
    refreshLockKey(kind, inputHash),
    "1",
    REFRESH_LOCK_SECONDS
  );
}

export async function deleteSearchBlob(
  kind: InventoryKind,
  inputHash: string
): Promise<void> {
  await getCacheClient().del(searchBlobKey(kind, inputHash));
}
