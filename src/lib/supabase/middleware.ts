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

function isLocalDevMap(request: NextRequest): boolean {
  if (process.env.NODE_ENV !== "development") return false;
  const host = request.nextUrl.hostname;
  return host === "localhost" || host === "127.0.0.1";
}

function isPublicRoute(pathname: string): boolean {
  return (
    pathname.startsWith("/auth") ||
    PUBLIC_ROUTES.some((route) => pathname === route)
  );
}

/** Unauthenticated users → site signup (prod) or map /login (localhost). */
function authGateRedirect(request: NextRequest): NextResponse {
  if (isLocalDevMap(request)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", request.url);
    return NextResponse.redirect(loginUrl);
  }

  const signupUrl = new URL("/signup", resolveSiteOriginFromRequest(request.url));
  signupUrl.searchParams.set("next", request.url);
  return NextResponse.redirect(signupUrl);
}

/** Refresh session and require auth — unauthenticated users go to signup / login. */
export async function updateSession(request: NextRequest) {
  const config = supabaseConfig();
  const pathname = request.nextUrl.pathname;

  if (!config) {
    if (!isPublicRoute(pathname)) {
      return authGateRedirect(request);
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
            // Production cookie domain breaks sessions on localhost.
            ...(cookieDomain && !isLocalDevMap(request) ? { domain: cookieDomain } : {}),
          });
        });
      },
    },
  });

  let user: { id: string } | null = null;

  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
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
    return authGateRedirect(request);
  }

  return supabaseResponse;
}
