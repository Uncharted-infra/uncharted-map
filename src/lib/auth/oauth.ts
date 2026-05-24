"use client";

import { authCallbackUrl } from "@/lib/auth/redirect";
import { createClient } from "@/lib/supabase/client";

export async function signInWithGoogle(next?: string) {
  const supabase = createClient();
  const requestUrl =
    typeof window !== "undefined" ? window.location.href : undefined;
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: authCallbackUrl(next, requestUrl),
    },
  });

  if (error) {
    throw error;
  }
}
