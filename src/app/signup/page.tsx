import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
          Free while we&apos;re Alpharetta-only. Takes two minutes.
        </p>
        <form className="mt-5 space-y-3">
          <div>
            <Label htmlFor="shop-name" className="font-mono text-[11px] font-bold uppercase text-muted-foreground">Shop name</Label>
            <Input id="shop-name" placeholder="Shop name" required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="email" className="font-mono text-[11px] font-bold uppercase text-muted-foreground">Email</Label>
            <Input id="email" type="email" placeholder="you@yourshop.com" required className="mt-1" />
          </div>
          <Button type="submit" className="w-full">Create account</Button>
        </form>
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
