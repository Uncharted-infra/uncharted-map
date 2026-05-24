import { mapOrigin as mapOriginFromEnv, siteOrigin as siteOriginFromEnv } from "@/lib/supabase/env";

export const PROD_SITE_ORIGIN = "https://uncharted.sh";
export const PROD_MAP_ORIGIN = "https://map.uncharted.sh";

const PROD_HOSTS = new Set([
  "uncharted.sh",
  "www.uncharted.sh",
  "map.uncharted.sh",
]);

function isProductionHost(hostname: string): boolean {
  return PROD_HOSTS.has(hostname);
}

/** Map origin — uses live hostname on uncharted.sh so OAuth never targets localhost. */
export function resolveMapOrigin(): string {
  if (typeof window !== "undefined") {
    if (isProductionHost(window.location.hostname)) {
      return PROD_MAP_ORIGIN;
    }
  }
  return mapOriginFromEnv();
}

/** Site origin — uses live hostname on uncharted.sh domains. */
export function resolveSiteOrigin(): string {
  if (typeof window !== "undefined") {
    if (isProductionHost(window.location.hostname)) {
      return PROD_SITE_ORIGIN;
    }
  }
  return siteOriginFromEnv();
}

export function resolveMapOriginFromRequest(requestUrl: string): string {
  try {
    const hostname = new URL(requestUrl).hostname;
    if (isProductionHost(hostname)) return PROD_MAP_ORIGIN;
  } catch {
    // Fall through.
  }
  return mapOriginFromEnv();
}

export function resolveSiteOriginFromRequest(requestUrl: string): string {
  try {
    const hostname = new URL(requestUrl).hostname;
    if (isProductionHost(hostname)) return PROD_SITE_ORIGIN;
  } catch {
    // Fall through.
  }
  return siteOriginFromEnv();
}

export function isLocalhostOrigin(origin: string): boolean {
  try {
    return new URL(origin).hostname === "localhost";
  } catch {
    return false;
  }
}
