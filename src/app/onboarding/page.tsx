import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const metadata = { title: "Set up your shop — Uncharted" };

export default function OnboardingPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-5">
      <Card className="w-full max-w-md p-6">
        <p className="font-mono text-[11px] font-bold uppercase text-main">
          Step 1 of 2
        </p>
        <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight">
          Tell us about your shop
        </h1>
        <form className="mt-5 space-y-3">
          <div>
            <Label htmlFor="shop-name" className="font-mono text-[11px] font-bold uppercase text-muted-foreground">Shop name</Label>
            <Input id="shop-name" placeholder="Shop name" required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="address" className="font-mono text-[11px] font-bold uppercase text-muted-foreground">Address</Label>
            <Input id="address" placeholder="Street address, Alpharetta" required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="phone" className="font-mono text-[11px] font-bold uppercase text-muted-foreground">Phone</Label>
            <Input id="phone" placeholder="Phone" className="mt-1" />
          </div>
          <Button type="submit" className="w-full">
            Continue →
          </Button>
        </form>
        <p className="mt-4 text-center font-mono text-[11px] font-bold text-muted-foreground">
          Just looking?{" "}
          <Link href="/dashboard" className="text-main hover:underline">
            Peek at the demo dashboard
          </Link>
        </p>
      </Card>
    </main>
  );
}
