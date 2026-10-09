import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
import { Card } from "@/components/ui/card";

export const metadata = { title: "Claim your shop — Uncharted" };

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-5">
      <Card className="w-full max-w-sm p-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-block size-4 border-2 border-border bg-main" />
          <span className="font-display text-lg font-extrabold tracking-tight">Uncharted</span>
        </Link>
        <h1 className="mt-6 font-display text-3xl font-extrabold tracking-tight">Claim your shop</h1>
        <p className="mt-1 text-sm font-medium text-muted-foreground">
          Free while we&apos;re in beta. Takes two minutes.
        </p>
        <AuthForm mode="signup" />
        <p className="mt-4 text-center font-mono text-[11px] font-bold text-muted-foreground">
          Have an account?{" "}
          <Link href="/login" className="text-main hover:underline">
            Sign in
          </Link>
        </p>
      </Card>
    </main>
  );
}
