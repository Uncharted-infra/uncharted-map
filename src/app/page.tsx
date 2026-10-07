import Link from "next/link";
import { Button } from "@/components/ui/button";

const siteOrigin = process.env.NEXT_PUBLIC_SITE_ORIGIN ?? "http://localhost:3000";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <div className="flex items-center gap-2">
        <span className="inline-block size-4 border-2 border-border bg-main" />
        <span className="font-display text-2xl font-extrabold tracking-tight">Uncharted</span>
      </div>
      <h1 className="mt-6 max-w-xl font-display text-4xl font-extrabold leading-tight tracking-tight">
        See what sells. Know what to bake.
      </h1>
      <p className="mt-3 max-w-md font-medium text-muted-foreground">
        The owner side of Uncharted — sales, inventory, and flavor trends for
        Alpharetta&apos;s sweet shops.
      </p>
      <div className="mt-7 flex gap-3">
        <Button render={<Link href="/login" />} size="lg">Sign in</Button>
        <Button render={<Link href="/dashboard" />} variant="neutral" size="lg">
          Demo dashboard
        </Button>
      </div>
      <a href={siteOrigin} className="mt-10 font-mono text-[11px] font-bold uppercase text-muted-foreground hover:text-foreground">
        ← Looking for sweets? uncharted.sh
      </a>
    </main>
  );
}
