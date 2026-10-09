import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { requireShop } from "@/lib/auth/shop";
import { data } from "@/lib/data";
import { cn } from "@/lib/utils";

export default async function InventoryPage() {
  const shop = await requireShop();
  const [inventory, suggestions] = await Promise.all([
    data.getInventory(shop.id),
    data.getReorderSuggestions(shop.id),
  ]);
  const suggestionBySku = new Map(suggestions.map((s) => [s.item.sku, s]));

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-3xl font-extrabold tracking-tight">Inventory</h1>
        <p className="mt-1 text-sm font-medium text-muted-foreground">
          What&apos;s on the shelf vs. what the week will eat.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
        <Card className="gap-0 overflow-hidden p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-sand-deep">
                <TableHead className="h-10 pl-4 font-mono text-[11px] font-bold uppercase">Item</TableHead>
                <TableHead className="h-10 font-mono text-[11px] font-bold uppercase">Supplier</TableHead>
                <TableHead className="h-10 text-right font-mono text-[11px] font-bold uppercase">On hand</TableHead>
                <TableHead className="h-10 text-right font-mono text-[11px] font-bold uppercase">Reorder at</TableHead>
                <TableHead className="h-10 pr-4 text-right font-mono text-[11px] font-bold uppercase">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map((item) => {
                const s = suggestionBySku.get(item.sku);
                const low = item.qty <= item.reorderPoint;
                return (
                  <TableRow key={item.id}>
                    <TableCell className="py-3 pl-4">
                      <p className="font-bold">{item.label}</p>
                      <p className="font-mono text-[11px] font-bold text-muted-foreground">{item.sku}</p>
                    </TableCell>
                    <TableCell className="py-3 font-medium text-muted-foreground">{item.supplier}</TableCell>
                    <TableCell className="py-3 text-right font-mono font-bold tabular-nums">
                      {item.qty} {item.unit}
                    </TableCell>
                    <TableCell className="py-3 text-right font-mono font-bold tabular-nums text-muted-foreground">
                      {item.reorderPoint} {item.unit}
                    </TableCell>
                    <TableCell className="py-3 pr-4 text-right">
                      {s ? (
                        <Badge>~{s.daysLeft}d left</Badge>
                      ) : low ? (
                        <Badge variant="neutral" className="bg-main text-main-foreground">
                          Reorder
                        </Badge>
                      ) : (
                        <Badge variant="neutral" className="bg-blue">
                          OK
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>

        <Card className={cn("h-fit bg-blue p-5", suggestions.length === 0 && "opacity-60")}>
          <p className="font-display text-lg font-extrabold">
            Reorder suggestions
          </p>
          <div className="mt-3 space-y-2">
            {suggestions.map((s) => (
              <div key={s.item.id} className="rounded-base border-2 border-border bg-secondary-background p-3">
                <p className="text-sm font-bold">{s.item.label}</p>
                <p className="mt-0.5 font-mono text-[11px] font-bold text-muted-foreground">
                  ~{s.daysLeft} days at current pace · {s.item.supplier}
                </p>
              </div>
            ))}
            {suggestions.length === 0 && (
              <p className="text-sm font-medium">Nothing to reorder this week.</p>
            )}
          </div>
          <p className="mt-4 border-t-2 border-border pt-3 font-mono text-[11px] font-bold leading-relaxed">
            Estimated from your last 14 days of sales. Gets smarter as you sell.
          </p>
        </Card>
      </div>
    </div>
  );
}
