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
      <aside className="hidden w-52 shrink-0 flex-col border-r border-line bg-vanilla/60 md:flex">
        <div className="flex h-14 items-center gap-2 border-b border-line px-5">
          <span className="inline-block h-3.5 w-3.5 rounded-[4px] bg-caramel" />
          <span className="font-display text-lg font-medium tracking-tight">Uncharted</span>
        </div>
        <nav className="flex-1 space-y-0.5 p-3">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "block rounded-lg px-3 py-2 font-mono text-xs tracking-wide uppercase transition-colors",
                pathname === l.href
                  ? "bg-ink text-cream"
                  : "text-muted hover:bg-white hover:text-ink"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-line p-3">
          <a
            href={siteOrigin}
            className="block rounded-lg px-3 py-2 font-mono text-xs tracking-wide uppercase text-muted hover:bg-white hover:text-ink"
          >
            ← uncharted.sh
          </a>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-line px-5">
          <span className="font-display text-lg font-medium">{shopName}</span>
          <nav className="flex gap-4 font-mono text-xs tracking-wide uppercase md:hidden">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(pathname === l.href ? "text-ink" : "text-muted")}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <span className="hidden font-mono text-[11px] tracking-wide uppercase text-muted md:block">
            Alpharetta, GA
          </span>
        </header>
        <main className="flex-1 px-5 py-6">{children}</main>
      </div>
    </div>
  );
}
