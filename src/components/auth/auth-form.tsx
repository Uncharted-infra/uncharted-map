"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export function AuthForm({ mode, next }: { mode: "login" | "signup"; next?: string }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callbackUrl = () => {
    const target =
      next && next.startsWith("/") ? next : mode === "signup" ? "/onboarding" : "/dashboard";
    return `${location.origin}/auth/callback?next=${encodeURIComponent(target)}`;
  };

  const sendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: callbackUrl() },
    });
    setPending(false);
    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
  };

  const continueWithGoogle = async () => {
    setPending(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: callbackUrl() },
    });
    if (error) {
      setPending(false);
      setError(error.message);
    }
  };

  if (sent) {
    return (
      <div className="mt-5 rounded-base border-2 border-border bg-secondary-background p-4 text-center">
        <p className="font-display text-lg font-extrabold">Check your email</p>
        <p className="mt-1 text-sm font-medium text-muted-foreground">
          We sent a link to <span className="font-bold text-foreground">{email}</span>
        </p>
      </div>
    );
  }

  return (
    <div className="mt-5 space-y-4">
      <form onSubmit={sendMagicLink} className="space-y-3">
        <div>
          <Label htmlFor="email" className="font-mono text-[11px] font-bold uppercase text-muted-foreground">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@yourshop.com"
            required
            className="mt-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {error && <p className="text-sm font-bold text-main">{error}</p>}
        <Button type="submit" className="w-full" disabled={pending}>
          {mode === "signup" ? "Create account" : "Send magic link"}
        </Button>
      </form>
      <div className="flex items-center gap-3">
        <span className="h-0.5 flex-1 bg-border" />
        <span className="font-mono text-[11px] font-bold uppercase text-muted-foreground">or</span>
        <span className="h-0.5 flex-1 bg-border" />
      </div>
      <Button variant="neutral" className="w-full" onClick={continueWithGoogle} disabled={pending}>
        Continue with Google
      </Button>
    </div>
  );
}
