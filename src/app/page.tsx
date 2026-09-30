import Link from "next/link";
import { buttonClasses } from "@/components/ui/button";

const siteOrigin = process.env.NEXT_PUBLIC_SITE_ORIGIN ?? "http://localhost:3000";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <div className="flex items-center gap-2">
        <span className="inline-block h-4 w-4 rounded-[4px] bg-caramel" />
        <span className="font-display text-2xl font-medium tracking-tight">Uncharted</span>
      </div>
      <h1 className="mt-6 max-w-xl font-display text-4xl font-medium leading-tight tracking-tight">
        See what sells. Know what to bake.
      </h1>
      <p className="mt-3 max-w-md text-muted">
        The owner side of Uncharted — sales, inventory, and flavor trends for
        Alpharetta&apos;s sweet shops.
      </p>
      <div className="mt-7 flex gap-3">
        <Link href="/login" className={buttonClasses({ size: "lg" })}>Sign in</Link>
        <Link href="/dashboard" className={buttonClasses({ variant: "ghost", size: "lg" })}>
          Demo dashboard
        </Link>
      </div>
      <a href={siteOrigin} className="mt-10 font-mono text-[11px] tracking-wide uppercase text-muted hover:text-ink">
        ← Looking for sweets? uncharted.sh
      </a>
    </main>
  );
}
