"use client";

import { authCallbackUrl } from "@/lib/auth/redirect";
import { createClient } from "@/lib/supabase/client";

export async function signInWithGoogle(next?: string) {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: authCallbackUrl(next),
    },
  });

  if (error) {
    throw error;
  }
}
