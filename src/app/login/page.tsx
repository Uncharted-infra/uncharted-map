import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const metadata = { title: "Sign in — Uncharted" };

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-5">
      <Card className="w-full max-w-sm p-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-block h-3.5 w-3.5 rounded-[4px] bg-caramel" />
          <span className="font-display text-lg font-medium tracking-tight">Uncharted</span>
        </Link>
        <h1 className="mt-6 font-display text-2xl font-medium tracking-tight">Welcome back</h1>
        <p className="mt-1 text-sm text-muted">We&apos;ll email you a sign-in link. No password.</p>
        <form className="mt-5 space-y-3">
          <Input type="email" placeholder="you@yourshop.com" required />
          <Button type="submit" className="w-full">Send magic link</Button>
        </form>
        <p className="mt-4 text-center font-mono text-[11px] tracking-wide text-muted">
          New here?{" "}
          <Link href="/signup" className="text-caramel hover:underline">
            Claim your shop
          </Link>
        </p>
      </Card>
    </main>
  );
}
