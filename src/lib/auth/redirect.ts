import { mapOrigin, siteOrigin } from "@/lib/supabase/env";

export function appRedirectUrl(): string {
  return `${mapOrigin()}/`;
}

export function authCallbackUrl(next?: string): string {
  const target = next || appRedirectUrl();
  return `${mapOrigin()}/auth/callback?next=${encodeURIComponent(target)}`;
}

export function sanitizeRedirectUrl(next: string | null | undefined): string {
  if (!next?.trim()) return appRedirectUrl();

  try {
    const url = new URL(next);
    const allowedOrigins = [mapOrigin(), siteOrigin()];

    if (allowedOrigins.includes(url.origin)) {
      return url.toString();
    }
  } catch {
    // Fall through to default.
  }

  return appRedirectUrl();
}
