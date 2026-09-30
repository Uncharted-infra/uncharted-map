"use client";

import { useState } from "react";
import { Price } from "@/components/ui/price";
import type { MenuItem } from "@/lib/data";
import { cn } from "@/lib/utils";

export function MenuList({ items }: { items: MenuItem[] }) {
  const [availability, setAvailability] = useState<Record<string, boolean>>(
    Object.fromEntries(items.map((i) => [i.id, i.available]))
  );

  const grouped = items.reduce<Record<string, MenuItem[]>>((acc, item) => {
    (acc[item.category] ??= []).push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {Object.entries(grouped).map(([category, catItems]) => (
        <section key={category}>
          <h2 className="font-mono text-[11px] font-bold tracking-wide uppercase text-muted">
            {category.replace("_", " ")}
          </h2>
          <div className="mt-3 divide-y divide-line rounded-2xl border border-line bg-white">
            {catItems.map((item) => {
              const on = availability[item.id];
              return (
                <div key={item.id} className="flex items-center justify-between gap-4 px-4 py-3">
                  <div className="min-w-0">
                    <p className={cn("font-medium", !on && "text-muted line-through")}>{item.name}</p>
                    <p className="truncate text-sm text-muted">{item.description}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-4">
                    <Price cents={item.priceCents} className="text-sm" />
                    <button
                      role="switch"
                      aria-checked={on}
                      aria-label={`${item.name} availability`}
                      onClick={() => setAvailability((a) => ({ ...a, [item.id]: !a[item.id] }))}
                      className={cn(
                        "relative h-6 w-11 rounded-full transition-colors",
                        on ? "bg-matcha" : "bg-line"
                      )}
                    >
                      <span
                        className={cn(
                          "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all",
                          on ? "left-[22px]" : "left-0.5"
                        )}
                      />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
