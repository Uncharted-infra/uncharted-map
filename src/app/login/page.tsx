import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
import { Card } from "@/components/ui/card";

export const metadata = { title: "Sign in — Uncharted" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center px-5">
      <Card className="w-full max-w-sm p-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-block size-4 border-2 border-border bg-main" />
          <span className="font-display text-lg font-extrabold tracking-tight">Uncharted</span>
        </Link>
        <h1 className="mt-6 font-display text-3xl font-extrabold tracking-tight">Welcome back</h1>
        <p className="mt-1 text-sm font-medium text-muted-foreground">We&apos;ll email you a sign-in link. No password.</p>
        {error === "auth" && (
          <p className="mt-3 text-sm font-bold text-main">That link expired — try again.</p>
        )}
        <AuthForm mode="login" next={next?.startsWith("/") ? next : undefined} />
        <p className="mt-4 text-center font-mono text-[11px] font-bold text-muted-foreground">
          New here?{" "}
          <Link href="/signup" className="text-main hover:underline">
            Claim your shop
          </Link>
        </p>
      </Card>
    </main>
  );
}
