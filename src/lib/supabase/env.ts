/** Canonical Supabase project ref — auth + all product data (one project until scale-out). */
export const SUPABASE_PROJECT_REF = "epgtqkixcynukyqoeioo";

function required(name: string, value: string | undefined): string {
  if (!value?.trim()) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value.trim();
}

export function supabaseUrl(): string {
  return required(
    "NEXT_PUBLIC_SUPABASE_URL",
    process.env.NEXT_PUBLIC_SUPABASE_URL
  );
}

export function supabaseAnonKey(): string {
  const publishable = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();
  if (publishable) return publishable;

  return required(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function authCookieDomain(): string | undefined {
  const raw = process.env.NEXT_PUBLIC_AUTH_COOKIE_DOMAIN?.trim();
  return raw || undefined;
}

export function siteOrigin(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_ORIGIN?.trim() || "http://localhost:3000";
  return raw.replace(/\/+$/, "");
}

export function mapOrigin(): string {
  const raw =
    process.env.NEXT_PUBLIC_MAP_ORIGIN?.trim() || "http://localhost:3001";
  return raw.replace(/\/+$/, "");
}
