"use client";

import { useState } from "react";
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

const STATUS_TONE: Record<string, string> = {
  placed: "bg-strawberry text-white",
  accepted: "bg-blueberry text-white",
  ready: "bg-matcha text-white",
  completed: "bg-vanilla text-muted border border-line",
  cancelled: "bg-vanilla text-muted border border-line line-through",
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
            <p className="font-medium">{o.customerName}</p>
            <span className={cn("rounded-md px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-wide uppercase", STATUS_TONE[o.status])}>
              {o.status}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted">
            {o.lines.map((l) => `${l.qty}× ${l.name}`).join(" · ")}
          </p>
          <p className="mt-1 font-mono text-[11px] text-muted">
            {new Date(o.placedAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })} · {o.fulfillment}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <span className="font-mono text-sm font-bold tabular-nums">{formatPrice(o.totalCents)}</span>
          {NEXT[o.status] && (
            <button
              onClick={() => advance(o.id)}
              className="rounded-lg bg-ink px-3 py-1.5 font-mono text-[11px] font-bold tracking-wide uppercase text-cream transition-transform hover:-translate-y-0.5"
            >
              {NEXT_LABEL[o.status]} →
            </button>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {active.length === 0 && <p className="text-sm text-muted">Queue is clear. Nice.</p>}
        {active.map(renderOrder)}
      </div>
      {done.length > 0 && (
        <div>
          <p className="font-mono text-[11px] font-bold tracking-wide uppercase text-muted">Earlier today</p>
          <div className="mt-3 space-y-3 opacity-70">{done.map(renderOrder)}</div>
        </div>
      )}
    </div>
  );
}
