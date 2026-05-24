"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

import { sanitizeRedirectUrl } from "@/lib/auth/redirect";

export function usePostAuthRedirectUrl(): string {
  const searchParams = useSearchParams();
  const next = searchParams.get("next");

  return useMemo(() => {
    const requestUrl =
      typeof window !== "undefined" ? window.location.href : undefined;
    return sanitizeRedirectUrl(next, requestUrl);
  }, [next]);
}

export function redirectAfterAuth(url: string) {
  window.location.assign(url);
}
