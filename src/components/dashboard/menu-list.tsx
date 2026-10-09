"use client";

import { useState, useTransition } from "react";
import { toggleAvailabilityAction } from "@/app/dashboard/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Price } from "@/components/ui/price";
import type { MenuItem } from "@/lib/data";
import { cn } from "@/lib/utils";

export function MenuList({ items }: { items: MenuItem[] }) {
  const [availability, setAvailability] = useState<Record<string, boolean>>(
    Object.fromEntries(items.map((i) => [i.id, i.available]))
  );
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const toggle = (itemId: string) => {
    const next = !availability[itemId];
    setError(null);
    setAvailability((a) => ({ ...a, [itemId]: next }));
    startTransition(async () => {
      try {
        await toggleAvailabilityAction(itemId, next);
      } catch {
        setAvailability((a) => ({ ...a, [itemId]: !next }));
        setError("Couldn't update that item — try again.");
      }
    });
  };

  const grouped = items.reduce<Record<string, MenuItem[]>>((acc, item) => {
    (acc[item.category] ??= []).push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {error && <p className="text-sm font-bold text-main">{error}</p>}
      {Object.entries(grouped).map(([category, catItems]) => (
        <section key={category}>
          <Badge variant="neutral" className="font-mono text-[11px] font-bold uppercase">
            {category.replace("_", " ")}
          </Badge>
          <Card className="mt-3 gap-0 divide-y-2 divide-border py-0">
            {catItems.map((item) => {
              const on = availability[item.id];
              return (
                <div key={item.id} className="flex items-center justify-between gap-4 px-4 py-3">
                  <div className="min-w-0">
                    <p className={cn("font-bold", !on && "text-muted-foreground line-through")}>{item.name}</p>
                    <p className="truncate text-sm font-medium text-muted-foreground">{item.description}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-4">
                    <Price cents={item.priceCents} className="text-sm font-bold" />
                    <Button
                      size="sm"
                      variant={on ? "default" : "neutral"}
                      onClick={() => toggle(item.id)}
                    >
                      {on ? "Available" : "Sold out"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </Card>
        </section>
      ))}
    </div>
  );
}
