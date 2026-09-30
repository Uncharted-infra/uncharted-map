import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/components/ui/price";
import { data, DEMO_SHOP_ID } from "@/lib/data";
import { cn } from "@/lib/utils";

const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const FLAVOR_TONES = ["bg-strawberry", "bg-matcha", "bg-blueberry", "bg-caramel", "bg-ink"] as const;

export default async function InsightsPage() {
  const [bestsellers, trends, networkTrends, heat] = await Promise.all([
    data.getBestsellers(DEMO_SHOP_ID, 5),
    data.getFlavorTrends(DEMO_SHOP_ID, 6),
    data.getFlavorTrends(null, 6), // whole Alpharetta network
    data.getDaypartHeat(DEMO_SHOP_ID),
  ]);

  const maxHeat = Math.max(...heat.flat());
  const maxUnits = Math.max(...bestsellers.map((b) => b.units));
  const risingNetwork = networkTrends.filter((t) => t.wowPct > 10).slice(0, 3);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-medium tracking-tight">Insights</h1>
        <p className="mt-1 text-sm text-muted">What your sales are telling you.</p>
      </div>

      {/* Flavor lab — the wedge */}
      <Card className="border-caramel/40 bg-vanilla p-5">
        <div className="flex items-center gap-2">
          <Badge tone="caramel" tilt={false}>Flavor lab</Badge>
          <span className="font-mono text-[11px] tracking-wide uppercase text-muted">
            What Alpharetta wants next
          </span>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {risingNetwork.map((t, i) => (
            <div key={t.tag} className="rounded-xl border border-line bg-white p-4">
              <div className="flex items-center gap-2">
                <span className={cn("inline-block h-2.5 w-2.5 rounded-[3px]", FLAVOR_TONES[i % FLAVOR_TONES.length])} />
                <p className="font-display text-lg font-medium">{t.tag}</p>
              </div>
              <p className="mt-1 font-mono text-[11px] text-matcha">▲ {t.wowPct}% week over week</p>
              <p className="mt-2 text-sm text-muted">
                {t.wowPct > 25
                  ? "Climbing fast across local shops — worth a test batch."
                  : "Steady climb — watch it or get ahead of it."}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-4 font-mono text-[11px] leading-relaxed text-muted">
          Trends are aggregated across every sweet shop in Alpharetta — your menu
          never sees the whole picture, but the network does.
        </p>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Bestsellers */}
        <Card className="p-5">
          <p className="font-mono text-[11px] font-bold tracking-wide uppercase text-muted">
            Best sellers · last 30 days
          </p>
          <div className="mt-4 space-y-3">
            {bestsellers.map((b, i) => (
              <div key={b.item.id}>
                <div className="flex items-baseline justify-between text-sm">
                  <span className="font-medium">
                    <span className="mr-2 font-mono text-[11px] text-muted">{i + 1}.</span>
                    {b.item.name}
                  </span>
                  <span className="font-mono text-xs text-muted">
                    {b.units} sold · {formatPrice(b.revenueCents)}
                  </span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-vanilla">
                  <div
                    className="h-full rounded-full bg-caramel"
                    style={{ width: `${(b.units / maxUnits) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Daypart heatmap */}
        <Card className="p-5">
          <p className="font-mono text-[11px] font-bold tracking-wide uppercase text-muted">
            When you sell · 7am–6pm
          </p>
          <div className="mt-4">
            <div className="grid grid-cols-[32px_repeat(12,1fr)] gap-1">
              <div />
              {Array.from({ length: 12 }, (_, h) => (
                <span key={h} className="text-center font-mono text-[9px] text-muted">
                  {h + 7}
                </span>
              ))}
              {heat.map((row, dow) => (
                <div key={dow} className="contents">
                  <span className="font-mono text-[9px] leading-4 text-muted">{DOW[dow]}</span>
                  {row.map((v, h) => (
                    <div
                      key={h}
                      title={`${DOW[dow]} ${h + 7}:00 — ${v} items`}
                      className="h-4 rounded-[3px] bg-caramel"
                      style={{ opacity: 0.08 + (v / maxHeat) * 0.92 }}
                    />
                  ))}
                </div>
              ))}
            </div>
            <p className="mt-3 font-mono text-[11px] text-muted">
              Saturday afternoons carry your week — staff accordingly.
            </p>
          </div>
        </Card>
      </div>

      {/* Your flavor trends */}
      <Card className="p-5">
        <p className="font-mono text-[11px] font-bold tracking-wide uppercase text-muted">
          Your flavors · week over week
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {trends.map((t) => (
            <span
              key={t.tag}
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-4 py-1.5 font-mono text-xs"
            >
              {t.tag}
              <span className={t.wowPct >= 0 ? "text-matcha" : "text-strawberry"}>
                {t.wowPct >= 0 ? "▲" : "▼"}{Math.abs(t.wowPct)}%
              </span>
            </span>
          ))}
        </div>
      </Card>
    </div>
  );
}
