import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const metadata = { title: "Claim your shop — Uncharted" };

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-5">
      <Card className="w-full max-w-sm p-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-block h-3.5 w-3.5 rounded-[4px] bg-caramel" />
          <span className="font-display text-lg font-medium tracking-tight">Uncharted</span>
        </Link>
        <h1 className="mt-6 font-display text-2xl font-medium tracking-tight">Claim your shop</h1>
        <p className="mt-1 text-sm text-muted">
          Free while we&apos;re Alpharetta-only. Takes two minutes.
        </p>
        <form className="mt-5 space-y-3">
          <Input placeholder="Shop name" required />
          <Input type="email" placeholder="you@yourshop.com" required />
          <Button type="submit" className="w-full">Create account</Button>
        </form>
        <p className="mt-4 text-center font-mono text-[11px] tracking-wide text-muted">
          Have an account?{" "}
          <Link href="/login" className="text-caramel hover:underline">
            Sign in
          </Link>
        </p>
      </Card>
    </main>
  );
}
