import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const metadata = { title: "Sign in — Uncharted" };

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-5">
      <Card className="w-full max-w-sm p-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-block size-4 border-2 border-border bg-main" />
          <span className="font-display text-lg font-extrabold tracking-tight">Uncharted</span>
        </Link>
        <h1 className="mt-6 font-display text-3xl font-extrabold tracking-tight">Welcome back</h1>
        <p className="mt-1 text-sm font-medium text-muted-foreground">We&apos;ll email you a sign-in link. No password.</p>
        <form className="mt-5 space-y-3">
          <div>
            <Label htmlFor="email" className="font-mono text-[11px] font-bold uppercase text-muted-foreground">Email</Label>
            <Input id="email" type="email" placeholder="you@yourshop.com" required className="mt-1" />
          </div>
          <Button type="submit" className="w-full">Send magic link</Button>
        </form>
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
