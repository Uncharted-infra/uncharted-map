"use client";

import { useState } from "react";

import { redirectAfterAuth, usePostAuthRedirectUrl } from "@/lib/auth/use-post-auth-redirect";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type PhoneAuthMode = "signIn" | "signUp";

interface PhoneAuthFormProps {
  mode?: PhoneAuthMode;
}

function normalizePhone(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("+")) return trimmed.replace(/\s+/g, "");
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return trimmed.startsWith("+") ? trimmed : `+${digits}`;
}

export function PhoneAuthForm({ mode = "signUp" }: PhoneAuthFormProps) {
  const postAuthRedirect = usePostAuthRedirectUrl();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendCode() {
    setLoading(true);
    setError(null);

    const normalized = normalizePhone(phone);
    if (!normalized || normalized.length < 8) {
      setError("Enter a valid phone number with country code.");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error: otpError } = await supabase.auth.signInWithOtp({
      phone: normalized,
      options: {
        shouldCreateUser: mode === "signUp",
      },
    });

    setLoading(false);

    if (otpError) {
      setError(otpError.message);
      return;
    }

    setPhone(normalized);
    setStep("otp");
  }

  async function verifyCode() {
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: verifyError } = await supabase.auth.verifyOtp({
      phone: phone,
      token: otp.trim(),
      type: "sms",
    });

    setLoading(false);

    if (verifyError) {
      setError(verifyError.message);
      return;
    }

    redirectAfterAuth(postAuthRedirect);
  }

  return (
    <div className="space-y-4">
      {step === "phone" ? (
        <>
          <div className="space-y-2">
            <Label htmlFor="phone" className="font-departure-mono">
              Phone number
            </Label>
            <Input
              id="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="+1 555 123 4567"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Include country code. We&apos;ll text you a one-time code.
            </p>
          </div>
          {error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : null}
          <Button
            type="button"
            className="font-departure-mono w-full"
            size="lg"
            disabled={loading}
            onClick={sendCode}
          >
            {loading ? "Sending code..." : "Send verification code"}
          </Button>
        </>
      ) : (
        <>
          <div className="space-y-2">
            <Label htmlFor="otp" className="font-departure-mono">
              Verification code
            </Label>
            <Input
              id="otp"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="123456"
              className="tracking-widest"
              value={otp}
              onChange={(event) => setOtp(event.target.value)}
            />
            <p className="text-xs text-muted-foreground">Sent to {phone}</p>
          </div>
          {error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : null}
          <Button
            type="button"
            className="font-departure-mono w-full"
            size="lg"
            disabled={loading || otp.trim().length < 4}
            onClick={verifyCode}
          >
            {loading ? "Verifying..." : "Verify and continue"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="font-departure-mono w-full"
            onClick={() => {
              setStep("phone");
              setOtp("");
              setError(null);
            }}
          >
            Use a different number
          </Button>
        </>
      )}
    </div>
  );
}
