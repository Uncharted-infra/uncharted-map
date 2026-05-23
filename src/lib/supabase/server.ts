import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { authCookieDomain, supabaseAnonKey, supabaseUrl } from "./env";

export async function createClient() {
  const cookieStore = await cookies();
  const cookieDomain = authCookieDomain();

  return createServerClient(supabaseUrl(), supabaseAnonKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, {
              ...options,
              ...(cookieDomain ? { domain: cookieDomain } : {}),
            });
          });
        } catch {
          // Called from a Server Component — middleware will refresh the session.
        }
      },
    },
  });
}
