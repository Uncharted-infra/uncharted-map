import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { data, DEMO_SHOP_ID } from "@/lib/data";
import { cn } from "@/lib/utils";

export default async function InventoryPage() {
  const [inventory, suggestions] = await Promise.all([
    data.getInventory(DEMO_SHOP_ID),
    data.getReorderSuggestions(DEMO_SHOP_ID),
  ]);
  const suggestionBySku = new Map(suggestions.map((s) => [s.item.sku, s]));

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-3xl font-medium tracking-tight">Inventory</h1>
        <p className="mt-1 text-sm text-muted">
          What&apos;s on the shelf vs. what the week will eat.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
        <Card className="overflow-hidden p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-vanilla/60 font-mono text-[11px] tracking-wide uppercase text-muted">
                <th className="px-4 py-3 text-left font-bold">Item</th>
                <th className="px-4 py-3 text-left font-bold">Supplier</th>
                <th className="px-4 py-3 text-right font-bold">On hand</th>
                <th className="px-4 py-3 text-right font-bold">Reorder at</th>
                <th className="px-4 py-3 text-right font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {inventory.map((item) => {
                const s = suggestionBySku.get(item.sku);
                const low = item.qty <= item.reorderPoint;
                return (
                  <tr key={item.id}>
                    <td className="px-4 py-3">
                      <p className="font-medium">{item.label}</p>
                      <p className="font-mono text-[11px] text-muted">{item.sku}</p>
                    </td>
                    <td className="px-4 py-3 text-muted">{item.supplier}</td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums">
                      {item.qty} {item.unit}
                    </td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums text-muted">
                      {item.reorderPoint} {item.unit}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {s ? (
                        <Badge tone="strawberry" tilt={false}>~{s.daysLeft}d left</Badge>
                      ) : low ? (
                        <Badge tone="caramel" tilt={false}>Low</Badge>
                      ) : (
                        <Badge tone="matcha" tilt={false}>OK</Badge>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>

        <Card className={cn("h-fit p-5", suggestions.length === 0 && "opacity-60")}>
          <p className="font-mono text-[11px] font-bold tracking-wide uppercase text-muted">
            Reorder suggestions
          </p>
          <div className="mt-3 space-y-2">
            {suggestions.map((s) => (
              <div key={s.item.id} className="rounded-lg border border-line p-3">
                <p className="text-sm font-medium">{s.item.label}</p>
                <p className="mt-0.5 font-mono text-[11px] text-muted">
                  ~{s.daysLeft} days at current pace · {s.item.supplier}
                </p>
              </div>
            ))}
            {suggestions.length === 0 && (
              <p className="text-sm text-muted">Nothing to reorder this week.</p>
            )}
          </div>
          <p className="mt-4 border-t border-line pt-3 font-mono text-[11px] leading-relaxed text-muted">
            Estimated from your last 14 days of sales. Gets smarter as you sell.
          </p>
        </Card>
      </div>
    </div>
  );
}
