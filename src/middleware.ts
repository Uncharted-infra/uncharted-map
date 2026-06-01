import { type NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all routes except static assets. Include "/" explicitly — the
     * negative-lookahead pattern alone does not match the root path.
     */
    "/",
    "/((?!_next/static|_next/image|favicon.ico|favicons/.*|img/.*|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
