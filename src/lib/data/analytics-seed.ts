import type { InventoryItem, MenuItem, Order, SalesDay } from "./types";
import { seedMenuItems, seedShops } from "./shops-seed";

// Deterministic mock analytics — seeded PRNG so every render/build sees the same numbers.

function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function isoDaysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

const WEEKEND_BOOST = 1.65;
const TRENDING_TAGS = new Set(["pistachio", "ube", "miso caramel", "cardamom"]);

function itemBaseUnits(item: MenuItem): number {
  let base = 2 + (hashString(item.id) % 5); // 2–6
  if (item.bestseller) base = Math.round(base * 1.8);
  return base;
}

/** 90 days of sales_daily across all seeded shops. */
export const seedSalesDaily: SalesDay[] = (() => {
  const rows: SalesDay[] = [];
  for (const shop of seedShops) {
    const items = seedMenuItems.filter((m) => m.shopId === shop.id);
    for (let day = 89; day >= 0; day--) {
      const date = isoDaysAgo(day);
      const dow = new Date(`${date}T12:00:00`).getDay();
      const weekend = dow === 0 || dow === 6 ? WEEKEND_BOOST : 1;
      const progress = (89 - day) / 89; // 0 → 1 over the window

      for (const item of items) {
        const rand = mulberry32(hashString(`${item.id}:${date}`));
        const trending = item.flavorTags.some((t) => TRENDING_TAGS.has(t));
        // Trending items grow over the 90-day window; others stay flat.
        const drift = trending ? 0.7 + 0.9 * progress : 0.9 + 0.2 * rand();
        const noise = 0.6 + rand() * 0.8;
        const units = Math.max(0, Math.round(itemBaseUnits(item) * weekend * drift * noise));
        if (units === 0) continue;
        rows.push({
          shopId: shop.id,
          date,
          itemId: item.id,
          units,
          revenueCents: units * item.priceCents,
        });
      }
    }
  }
  return rows;
})();

const INVENTORY_SKUS: Omit<InventoryItem, "id" | "shopId">[] = [
  { sku: "FLR-001", label: "Bread flour", unit: "lbs", qty: 38, reorderPoint: 25, supplier: "Regional Mill Co." },
  { sku: "BTR-014", label: "Unsalted butter", unit: "lbs", qty: 12, reorderPoint: 15, supplier: "Dairy Direct" },
  { sku: "SGR-002", label: "Cane sugar", unit: "lbs", qty: 44, reorderPoint: 20, supplier: "Regional Mill Co." },
  { sku: "EGG-030", label: "Eggs", unit: "dozen", qty: 9, reorderPoint: 8, supplier: "Fannin Farms" },
  { sku: "PST-088", label: "Pistachio paste", unit: "kg", qty: 1.2, reorderPoint: 2, supplier: "Sicily Imports" },
  { sku: "UBE-031", label: "Ube halaya", unit: "kg", qty: 3.5, reorderPoint: 2, supplier: "Manila Provisions" },
  { sku: "CDM-019", label: "Cardamom (ground)", unit: "g", qty: 180, reorderPoint: 250, supplier: "Spice Route" },
  { sku: "MCH-042", label: "Matcha (ceremonial)", unit: "g", qty: 420, reorderPoint: 200, supplier: "Uji Tea Co." },
  { sku: "PKG-110", label: "Pastry boxes", unit: "count", qty: 140, reorderPoint: 100, supplier: "PackRight" },
];

export function seedInventoryFor(shopId: string): InventoryItem[] {
  return INVENTORY_SKUS.map((s, i) => ({ ...s, id: `inv-${shopId}-${i}`, shopId }));
}

const ORDER_NAMES = [
  "Maya R.", "Jordan T.", "Priya K.", "Sam W.", "Elena G.",
  "Chris B.", "Fatima A.", "Drew H.", "Nina S.", "Tom O.",
];

export function seedOrdersFor(shopId: string): Order[] {
  const items = seedMenuItems.filter((m) => m.shopId === shopId);
  const statuses: Order["status"][] = ["placed", "placed", "accepted", "accepted", "ready", "placed", "accepted", "ready", "completed", "placed"];
  return ORDER_NAMES.map((name, i) => {
    const rand = mulberry32(hashString(`${shopId}:order:${i}`));
    const lineCount = 1 + Math.floor(rand() * 2);
    const lines = Array.from({ length: lineCount }, () => {
      const item = items[Math.floor(rand() * items.length)];
      const qty = 1 + Math.floor(rand() * 3);
      return { itemId: item.id, name: item.name, qty, unitPriceCents: item.priceCents };
    });
    const totalCents = lines.reduce((n, l) => n + l.qty * l.unitPriceCents, 0);
    const placedAt = new Date(Date.now() - (i + 1) * 47 * 60_000).toISOString();
    return {
      id: `ord-${shopId}-${i}`,
      shopId,
      customerName: name,
      customerEmail: `${name.split(" ")[0].toLowerCase()}@example.com`,
      status: statuses[i % statuses.length],
      fulfillment: "pickup" as const,
      totalCents,
      placedAt,
      lines,
    };
  });
}
