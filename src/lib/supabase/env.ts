/** Canonical Supabase project ref — auth + all product data (one project until scale-out). */
export const SUPABASE_PROJECT_REF = "epgtqkixcynukyqoeioo";

const PROD_SITE_ORIGIN = "https://uncharted.sh";
const PROD_MAP_ORIGIN = "https://map.uncharted.sh";

function isProductionDeploy(): boolean {
  return (
    process.env.VERCEL_ENV === "production" ||
    process.env.NODE_ENV === "production"
  );
}

function originFromEnv(name: string, prodDefault: string, devDefault: string): string {
  const fromEnv = process.env[name]?.trim();
  if (fromEnv) return fromEnv.replace(/\/+$/, "");
  if (isProductionDeploy()) return prodDefault;
  return devDefault;
}

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
  return originFromEnv(
    "NEXT_PUBLIC_SITE_ORIGIN",
    PROD_SITE_ORIGIN,
    "http://localhost:3000"
  );
}

export function mapOrigin(): string {
  return originFromEnv(
    "NEXT_PUBLIC_MAP_ORIGIN",
    PROD_MAP_ORIGIN,
    "http://localhost:3001"
  );
}
