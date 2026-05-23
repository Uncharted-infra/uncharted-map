"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

import { appRedirectUrl, sanitizeRedirectUrl } from "@/lib/auth/redirect";

export function usePostAuthRedirectUrl(): string {
  const searchParams = useSearchParams();
  const next = searchParams.get("next");

  return useMemo(
    () => sanitizeRedirectUrl(next ?? appRedirectUrl()),
    [next]
  );
}

export function redirectAfterAuth(url: string) {
  window.location.assign(url);
}
