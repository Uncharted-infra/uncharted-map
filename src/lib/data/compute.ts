import type {
  Bestseller,
  DailyRevenue,
  FlavorTrend,
  InventoryItem,
  MenuItem,
  ReorderSuggestion,
  SalesDay,
} from "./types";

function hashNum(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function lastNDates(n: number): string[] {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (n - 1 - i));
    return d.toISOString().slice(0, 10);
  });
}

export function computeDailyRevenue(rows: SalesDay[], days: number): DailyRevenue[] {
  return lastNDates(days).map((date) => {
    const dayRows = rows.filter((r) => r.date === date);
    return {
      date,
      revenueCents: dayRows.reduce((n, r) => n + r.revenueCents, 0),
      orders: Math.round(dayRows.reduce((n, r) => n + r.units, 0) / 3),
    };
  });
}

export function computeBestsellers(rows: SalesDay[], items: MenuItem[], limit: number): Bestseller[] {
  const byItem = new Map<string, Bestseller>();
  for (const r of rows) {
    const item = items.find((m) => m.id === r.itemId);
    if (!item) continue;
    let b = byItem.get(r.itemId);
    if (!b) {
      b = { item, units: 0, revenueCents: 0 };
      byItem.set(r.itemId, b);
    }
    b.units += r.units;
    b.revenueCents += r.revenueCents;
  }
  return [...byItem.values()].sort((a, b) => b.units - a.units).slice(0, limit);
}

/** 14-day week-over-week flavor-tag trends. */
export function computeFlavorTrends(rows: SalesDay[], items: MenuItem[], limit: number): FlavorTrend[] {
  const dates = lastNDates(14);
  const lastWeek = new Set(dates.slice(7));
  const prevWeek = new Set(dates.slice(0, 7));

  const tally = new Map<string, { last: number; prev: number }>();
  for (const r of rows) {
    const item = items.find((m) => m.id === r.itemId);
    if (!item) continue;
    const inLast = lastWeek.has(r.date);
    const inPrev = prevWeek.has(r.date);
    if (!inLast && !inPrev) continue;
    for (const tag of item.flavorTags) {
      let t = tally.get(tag);
      if (!t) {
        t = { last: 0, prev: 0 };
        tally.set(tag, t);
      }
      if (inLast) t.last += r.units;
      if (inPrev) t.prev += r.units;
    }
  }
  return [...tally.entries()]
    .filter(([, t]) => t.last + t.prev >= 20)
    .map(([tag, t]) => ({
      tag,
      unitsLastWeek: t.last,
      unitsPrevWeek: t.prev,
      wowPct: t.prev === 0 ? 100 : Math.round(((t.last - t.prev) / t.prev) * 100),
    }))
    .sort((a, b) => b.wowPct - a.wowPct)
    .slice(0, limit);
}

/** 14-day velocity heuristic: burn ≈ a fraction of daily item velocity (shared pantry model). */
export function computeReorderSuggestions(
  inventory: InventoryItem[],
  rows: SalesDay[]
): ReorderSuggestion[] {
  const dailyUnits = rows.reduce((n, r) => n + r.units, 0) / 14;

  return inventory
    .map((item) => {
      const dailyBurn = Math.max(0.2, dailyUnits * (item.unit === "count" ? 1.5 : 0.12));
      const daysLeft = Math.round(item.qty / dailyBurn);
      return { item, daysLeft, dailyBurn };
    })
    .filter((s) => s.item.qty <= s.item.reorderPoint || s.daysLeft <= 7)
    .sort((a, b) => a.daysLeft - b.daysLeft);
}

/** 7 rows (Sun–Sat) × 12 cols (7am–6pm) unit counts. */
export function computeDaypartHeat(shopId: string): number[][] {
  // Placeholder: deterministic hash-based shape until hourly sales data exists.
  const rand = (d: number, h: number) => {
    let x = Math.imul(hashNum(`${shopId}${d}${h}`), 2654435761) >>> 0;
    x ^= x >>> 13;
    return (x % 1000) / 1000;
  };
  // Sat/Sun 12–4pm peak; weekday morning bump — bakery daypart shape.
  return Array.from({ length: 7 }, (_, dow) =>
    Array.from({ length: 12 }, (_, h) => {
      const hour = h + 7;
      const weekend = dow === 0 || dow === 6;
      const peak = weekend ? hour >= 11 && hour <= 15 : hour >= 7 && hour <= 10;
      const base = peak ? (weekend ? 14 : 8) : 3;
      return Math.round(base * (0.6 + rand(dow, hour) * 0.8));
    })
  );
}
