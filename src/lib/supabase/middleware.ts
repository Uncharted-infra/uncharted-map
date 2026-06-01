import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

import { resolveSiteOriginFromRequest } from "@/lib/auth/origins";
import { authCookieDomain } from "./env";

const PUBLIC_ROUTES = ["/login", "/signup"];

/** Supabase config for middleware — optional so local dev survives missing env. */
function supabaseConfig(): { url: string; anonKey: string } | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!url || !anonKey) return null;
  return { url, anonKey };
}

function isPublicRoute(pathname: string): boolean {
  return (
    pathname.startsWith("/auth") ||
    PUBLIC_ROUTES.some((route) => pathname === route)
  );
}

function marketingSignupRedirect(request: NextRequest): NextResponse {
  const signupUrl = new URL("/signup", resolveSiteOriginFromRequest(request.url));
  signupUrl.searchParams.set("next", request.url);
  return NextResponse.redirect(signupUrl);
}

/** Refresh session and require auth — unauthenticated users go to uncharted.sh/signup. */
export async function updateSession(request: NextRequest) {
  const config = supabaseConfig();
  const pathname = request.nextUrl.pathname;

  if (!config) {
    if (!isPublicRoute(pathname)) {
      return marketingSignupRedirect(request);
    }
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });
  const cookieDomain = authCookieDomain();

  const supabase = createServerClient(config.url, config.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, {
            ...options,
            ...(cookieDomain ? { domain: cookieDomain } : {}),
          });
        });
      },
    },
  });

  let user: { id: string } | null = null;

  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      // Stale refresh token or Supabase unreachable — common on localhost.
      if (process.env.NODE_ENV === "development") {
        return supabaseResponse;
      }
    } else {
      user = data.user;
    }
  } catch {
    if (process.env.NODE_ENV === "development") {
      return supabaseResponse;
    }
  }

  if (!user && !isPublicRoute(pathname)) {
    return marketingSignupRedirect(request);
  }

  return supabaseResponse;
}
