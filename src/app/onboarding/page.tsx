import Link from "next/link";
import { buttonClasses } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const metadata = { title: "Set up your shop — Uncharted" };

export default function OnboardingPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-5">
      <Card className="w-full max-w-md p-6">
        <p className="font-mono text-[11px] font-bold tracking-wide uppercase text-caramel">
          Step 1 of 2
        </p>
        <h1 className="mt-2 font-display text-2xl font-medium tracking-tight">
          Tell us about your shop
        </h1>
        <form className="mt-5 space-y-3">
          <Input placeholder="Shop name" required />
          <Input placeholder="Street address, Alpharetta" required />
          <Input placeholder="Phone" />
          <button type="submit" className={buttonClasses({ className: "w-full" })}>
            Continue →
          </button>
        </form>
        <p className="mt-4 text-center font-mono text-[11px] tracking-wide text-muted">
          Just looking?{" "}
          <Link href="/dashboard" className="text-caramel hover:underline">
            Peek at the demo dashboard
          </Link>
        </p>
      </Card>
    </main>
  );
}
