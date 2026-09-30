import Link from "next/link";
import { RevenueSparkline } from "@/components/dashboard/sparkline";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/components/ui/price";
import { data, DEMO_SHOP_ID } from "@/lib/data";

export default async function DashboardPage() {
  const [revenue, bestsellers, orders, suggestions] = await Promise.all([
    data.getDailyRevenue(DEMO_SHOP_ID, 7),
    data.getBestsellers(DEMO_SHOP_ID, 3),
    data.getOrders(DEMO_SHOP_ID),
    data.getReorderSuggestions(DEMO_SHOP_ID),
  ]);

  const weekRevenue = revenue.reduce((n, d) => n + d.revenueCents, 0);
  const weekOrders = revenue.reduce((n, d) => n + d.orders, 0);
  const open = orders.filter((o) => o.status === "placed" || o.status === "accepted").length;
  const top = bestsellers[0];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="This week" value={formatPrice(weekRevenue)} hint="▲ vs last week" hintTone="matcha" />
        <StatCard label="Orders this week" value={String(weekOrders)} hint={`${open} open right now`} />
        <StatCard label="Top item" value={top?.item.name ?? "—"} hint={top ? `${top.units} sold · 30d` : undefined} />
        <StatCard
          label="Running low"
          value={String(suggestions.length)}
          hint={suggestions.length > 0 ? `Reorder ${suggestions[0].item.label}` : "Pantry is stocked"}
          hintTone={suggestions.length > 0 ? "strawberry" : "matcha"}
        />
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between">
          <p className="font-mono text-[11px] font-bold tracking-wide uppercase text-muted">
            Revenue · last 7 days
          </p>
          <Link href="/dashboard/insights" className="font-mono text-[11px] tracking-wide uppercase text-caramel hover:underline">
            Full insights →
          </Link>
        </div>
        <div className="mt-4">
          <RevenueSparkline days={revenue} />
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <p className="font-mono text-[11px] font-bold tracking-wide uppercase text-muted">Open orders</p>
          <div className="mt-3 space-y-2">
            {orders.filter((o) => o.status !== "completed" && o.status !== "cancelled").slice(0, 4).map((o) => (
              <div key={o.id} className="flex items-center justify-between rounded-lg border border-line px-3 py-2">
                <div>
                  <p className="text-sm font-medium">{o.customerName}</p>
                  <p className="font-mono text-[11px] text-muted">
                    {o.lines.map((l) => `${l.qty}× ${l.name}`).join(", ")}
                  </p>
                </div>
                <span className="rounded-md bg-vanilla px-2 py-0.5 font-mono text-[10px] font-bold tracking-wide uppercase">
                  {o.status}
                </span>
              </div>
            ))}
          </div>
          <Link href="/dashboard/orders" className="mt-3 inline-block font-mono text-[11px] tracking-wide uppercase text-caramel hover:underline">
            All orders →
          </Link>
        </Card>

        <Card className="p-5">
          <p className="font-mono text-[11px] font-bold tracking-wide uppercase text-muted">Reorder soon</p>
          <div className="mt-3 space-y-2">
            {suggestions.slice(0, 4).map((s) => (
              <div key={s.item.id} className="flex items-center justify-between rounded-lg border border-line px-3 py-2">
                <div>
                  <p className="text-sm font-medium">{s.item.label}</p>
                  <p className="font-mono text-[11px] text-muted">{s.item.supplier}</p>
                </div>
                <span className={`font-mono text-[11px] font-bold ${s.daysLeft <= 3 ? "text-strawberry" : "text-caramel"}`}>
                  ~{s.daysLeft}d left
                </span>
              </div>
            ))}
            {suggestions.length === 0 && (
              <p className="py-3 text-sm text-muted">Pantry is stocked. Nothing to reorder.</p>
            )}
          </div>
          <Link href="/dashboard/inventory" className="mt-3 inline-block font-mono text-[11px] tracking-wide uppercase text-caramel hover:underline">
            Inventory →
          </Link>
        </Card>
      </div>
    </div>
  );
}
