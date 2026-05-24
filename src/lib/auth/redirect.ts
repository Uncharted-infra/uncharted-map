import {
  isLocalhostOrigin,
  PROD_MAP_ORIGIN,
  PROD_SITE_ORIGIN,
  resolveMapOrigin,
  resolveMapOriginFromRequest,
  resolveSiteOrigin,
  resolveSiteOriginFromRequest,
} from "@/lib/auth/origins";

export function appRedirectUrl(): string {
  return `${resolveMapOrigin()}/`;
}

export function authCallbackUrl(next?: string, requestUrl?: string): string {
  const mapOrigin = requestUrl
    ? resolveMapOriginFromRequest(requestUrl)
    : resolveMapOrigin();
  const target = next
    ? sanitizeRedirectUrl(next, requestUrl)
    : `${mapOrigin}/`;
  return `${mapOrigin}/auth/callback?next=${encodeURIComponent(target)}`;
}

export function sanitizeRedirectUrl(
  next: string | null | undefined,
  requestUrl?: string
): string {
  const fallback = requestUrl
    ? `${resolveMapOriginFromRequest(requestUrl)}/`
    : appRedirectUrl();

  if (!next?.trim()) return fallback;

  try {
    const url = new URL(next);
    const onProduction =
      requestUrl != null &&
      (resolveMapOriginFromRequest(requestUrl) === PROD_MAP_ORIGIN ||
        resolveSiteOriginFromRequest(requestUrl) === PROD_SITE_ORIGIN);

    if (onProduction && isLocalhostOrigin(url.origin)) {
      return fallback;
    }

    const allowedOrigins = requestUrl
      ? [
          resolveMapOriginFromRequest(requestUrl),
          resolveSiteOriginFromRequest(requestUrl),
          PROD_MAP_ORIGIN,
          PROD_SITE_ORIGIN,
        ]
      : [resolveMapOrigin(), resolveSiteOrigin(), PROD_MAP_ORIGIN, PROD_SITE_ORIGIN];

    if (allowedOrigins.includes(url.origin)) {
      return url.toString();
    }
  } catch {
    // Fall through to default.
  }

  return fallback;
}
