"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/components/ui/price";
import type { Order } from "@/lib/data";
import { cn } from "@/lib/utils";

const NEXT: Record<string, Order["status"] | null> = {
  placed: "accepted",
  accepted: "ready",
  ready: "completed",
  completed: null,
  cancelled: null,
};

const NEXT_LABEL: Record<string, string> = {
  placed: "Accept",
  accepted: "Mark ready",
  ready: "Complete",
};

const STATUS_FILL: Record<string, string> = {
  placed: "bg-secondary-background",
  accepted: "bg-main text-main-foreground",
  ready: "bg-blue",
  completed: "bg-sand-deep",
  cancelled: "bg-sand-deep line-through",
};

export function OrdersQueue({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const active = orders.filter((o) => o.status !== "completed" && o.status !== "cancelled");
  const done = orders.filter((o) => o.status === "completed" || o.status === "cancelled");

  const advance = (id: string) =>
    setOrders((prev) =>
      prev.map((o) => (o.id === id && NEXT[o.status] ? { ...o, status: NEXT[o.status]! } : o))
    );

  const renderOrder = (o: Order) => (
    <Card key={o.id} className="p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-bold">{o.customerName}</p>
            <Badge
              variant="neutral"
              className={cn("font-mono font-bold uppercase", STATUS_FILL[o.status])}
            >
              {o.status}
            </Badge>
          </div>
          <p className="mt-1 text-sm font-medium text-muted-foreground">
            {o.lines.map((l) => `${l.qty}× ${l.name}`).join(" · ")}
          </p>
          <p className="mt-1 font-mono text-[11px] font-bold text-muted-foreground">
            {new Date(o.placedAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })} · {o.fulfillment}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <span className="font-mono text-sm font-bold tabular-nums">{formatPrice(o.totalCents)}</span>
          {NEXT[o.status] && (
            <Button size="sm" onClick={() => advance(o.id)}>
              {NEXT_LABEL[o.status]} →
            </Button>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {active.length === 0 && <p className="text-sm font-medium text-muted-foreground">Queue is clear. Nice.</p>}
        {active.map(renderOrder)}
      </div>
      {done.length > 0 && (
        <div>
          <p className="font-mono text-[11px] font-bold uppercase text-muted-foreground">Earlier today</p>
          <div className="mt-3 space-y-3 opacity-70">{done.map(renderOrder)}</div>
        </div>
      )}
    </div>
  );
}
