export function supabaseUrl(): string | undefined {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || undefined;
}

export function supabaseKey(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    undefined
  );
}

export function hasSupabaseEnv(): boolean {
  return Boolean(supabaseUrl() && supabaseKey());
}

export function authCookieDomain(): string | undefined {
  return process.env.AUTH_COOKIE_DOMAIN || undefined;
}

export function mapOrigin(): string {
  return process.env.NEXT_PUBLIC_MAP_ORIGIN ?? "http://localhost:3001";
}

export function siteOrigin(): string {
  return process.env.NEXT_PUBLIC_SITE_ORIGIN ?? "http://localhost:3000";
}
