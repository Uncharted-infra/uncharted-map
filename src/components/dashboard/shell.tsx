"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/dashboard", label: "Today" },
  { href: "/dashboard/orders", label: "Orders" },
  { href: "/dashboard/menu", label: "Menu" },
  { href: "/dashboard/inventory", label: "Inventory" },
  { href: "/dashboard/insights", label: "Insights" },
  { href: "/dashboard/settings", label: "Settings" },
];

const siteOrigin = process.env.NEXT_PUBLIC_SITE_ORIGIN ?? "http://localhost:3000";

export function DashboardShell({
  shopName,
  children,
}: {
  shopName: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-56 shrink-0 flex-col border-r-2 border-border bg-sand-deep md:flex">
        <div className="flex h-16 items-center gap-2 border-b-2 border-border px-5">
          <span className="inline-block size-4 border-2 border-border bg-main" />
          <span className="font-display text-xl font-extrabold tracking-tight">Uncharted</span>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "block rounded-base border-2 border-transparent px-3 py-2 text-sm font-bold transition-colors",
                pathname === l.href
                  ? "border-border bg-main text-main-foreground shadow-shadow"
                  : "hover:border-border hover:bg-secondary-background"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="border-t-2 border-border p-3">
          <a
            href={siteOrigin}
            className="block rounded-base border-2 border-transparent px-3 py-2 text-sm font-bold transition-colors hover:border-border hover:bg-secondary-background"
          >
            ← uncharted.sh
          </a>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b-2 border-border bg-background px-6">
          <span className="font-display text-xl font-extrabold">{shopName}</span>
          <nav className="flex gap-4 text-sm font-bold md:hidden">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(pathname === l.href ? "text-main" : "text-muted-foreground")}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <span className="hidden rounded-base border-2 border-border bg-secondary-background px-2 py-0.5 font-mono text-xs font-bold md:block">
            Alpharetta, GA
          </span>
        </header>
        <main className="flex-1 px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
