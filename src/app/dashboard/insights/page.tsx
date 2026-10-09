import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/components/ui/price";
import { requireShop } from "@/lib/auth/shop";
import { data } from "@/lib/data";
import { cn } from "@/lib/utils";

const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const FLAVOR_TONES = ["bg-main", "bg-blue", "bg-sand-deep", "bg-foreground", "bg-secondary-background"] as const;
const HEAT_STOPS = ["bg-blue/20", "bg-blue/40", "bg-blue/70", "bg-blue"] as const;

export default async function InsightsPage() {
  const shop = await requireShop();
  const [bestsellers, trends, networkTrends, heat] = await Promise.all([
    data.getBestsellers(shop.id, 5),
    data.getFlavorTrends(shop.id, 6),
    data.getFlavorTrends(null, 6), // network-wide
    data.getDaypartHeat(shop.id),
  ]);

  const maxHeat = Math.max(...heat.flat());
  const maxUnits = Math.max(...bestsellers.map((b) => b.units));
  const risingNetwork = networkTrends.filter((t) => t.wowPct > 10).slice(0, 3);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-extrabold tracking-tight">Insights</h1>
        <p className="mt-1 text-sm font-medium text-muted-foreground">What your sales are telling you.</p>
      </div>

      {/* Flavor lab — the wedge */}
      <Card className="bg-blue p-5">
        <div className="flex items-center gap-2">
          <Badge variant="neutral" className="font-bold uppercase">Flavor lab</Badge>
          <span className="font-mono text-[11px] font-bold uppercase">
            What the network wants next
          </span>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {risingNetwork.map((t, i) => (
            <div key={t.tag} className="rounded-base border-2 border-border bg-secondary-background p-4 shadow-shadow">
              <div className="flex items-center gap-2">
                <span className={cn("inline-block size-2.5 border-2 border-border", FLAVOR_TONES[i % FLAVOR_TONES.length])} />
                <p className="font-display text-lg font-extrabold">{t.tag}</p>
              </div>
              <p className="mt-1 font-mono text-[11px] font-bold">▲ {t.wowPct}% week over week</p>
              <p className="mt-2 text-sm font-medium text-muted-foreground">
                {t.wowPct > 25
                  ? "Climbing fast across local shops — worth a test batch."
                  : "Steady climb — watch it or get ahead of it."}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-4 font-mono text-[11px] font-bold leading-relaxed">
          Trends are aggregated across every shop on Uncharted — your menu
          never sees the whole picture, but the network does.
        </p>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Bestsellers */}
        <Card className="p-5">
          <p className="font-mono text-[11px] font-bold uppercase">
            Best sellers · last 30 days
          </p>
          <div className="mt-4 space-y-3">
            {bestsellers.map((b, i) => (
              <div key={b.item.id}>
                <div className="flex items-baseline justify-between text-sm">
                  <span className="font-bold">
                    <span className="mr-2 font-mono text-[11px] font-bold text-muted-foreground">{i + 1}.</span>
                    {b.item.name}
                  </span>
                  <span className="font-mono text-xs font-bold text-muted-foreground">
                    {b.units} sold · {formatPrice(b.revenueCents)}
                  </span>
                </div>
                <div className="mt-1 h-3 overflow-hidden rounded-base border-2 border-border bg-sand-deep">
                  <div
                    className="h-full bg-main"
                    style={{ width: `${(b.units / maxUnits) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Daypart heatmap */}
        <Card className="p-5">
          <p className="font-mono text-[11px] font-bold uppercase">
            When you sell · 7am–6pm
          </p>
          <div className="mt-4">
            <div className="grid grid-cols-[32px_repeat(12,1fr)] gap-1">
              <div />
              {Array.from({ length: 12 }, (_, h) => (
                <span key={h} className="text-center font-mono text-[9px] font-bold text-muted-foreground">
                  {h + 7}
                </span>
              ))}
              {heat.map((row, dow) => (
                <div key={dow} className="contents">
                  <span className="font-mono text-[9px] font-bold leading-4 text-muted-foreground">{DOW[dow]}</span>
                  {row.map((v, h) => (
                    <div
                      key={h}
                      title={`${DOW[dow]} ${h + 7}:00 — ${v} items`}
                      className={cn(
                        "h-4 rounded-base border-2 border-border",
                        v === maxHeat && v > 0 ? "bg-main" : HEAT_STOPS[Math.min(3, Math.floor((v / maxHeat) * 4))]
                      )}
                    />
                  ))}
                </div>
              ))}
            </div>
            <p className="mt-3 font-mono text-[11px] font-bold text-muted-foreground">
              Saturday afternoons carry your week — staff accordingly.
            </p>
          </div>
        </Card>
      </div>

      {/* Your flavor trends */}
      <Card className="p-5">
        <p className="font-mono text-[11px] font-bold uppercase">
          Your flavors · week over week
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {trends.map((t) => (
            <span
              key={t.tag}
              className="inline-flex items-center gap-1.5 rounded-base border-2 border-border bg-secondary-background px-3 py-1 font-mono text-xs font-bold"
            >
              {t.tag}
              <span
                className={cn(
                  "rounded-base border-2 border-border px-1",
                  t.wowPct >= 0 ? "bg-blue" : "bg-main text-main-foreground"
                )}
              >
                {t.wowPct >= 0 ? "▲" : "▼"}{Math.abs(t.wowPct)}%
              </span>
            </span>
          ))}
        </div>
      </Card>
    </div>
  );
}
