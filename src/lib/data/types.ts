import { z } from "zod";

export const shopCategorySchema = z.enum(["cakes", "cookies", "ice_cream", "pastry", "candy"]);
export type ShopCategory = z.infer<typeof shopCategorySchema>;

export const shopSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  categories: z.array(shopCategorySchema),
  story: z.string(),
  phone: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  lat: z.number(),
  lng: z.number(),
  hours: z.record(z.string(), z.string()),
  photo: z.string().nullable(),
  status: z.enum(["active", "pending", "paused"]),
});
export type Shop = z.infer<typeof shopSchema>;

export const menuItemSchema = z.object({
  id: z.string(),
  shopId: z.string(),
  name: z.string(),
  description: z.string(),
  priceCents: z.number().int(),
  category: shopCategorySchema,
  flavorTags: z.array(z.string()),
  photo: z.string().nullable(),
  available: z.boolean(),
  bestseller: z.boolean().default(false),
});
export type MenuItem = z.infer<typeof menuItemSchema>;

export const salesDaySchema = z.object({
  shopId: z.string(),
  date: z.string(), // ISO yyyy-mm-dd
  itemId: z.string(),
  units: z.number().int(),
  revenueCents: z.number().int(),
});
export type SalesDay = z.infer<typeof salesDaySchema>;

export const orderSchema = z.object({
  id: z.string(),
  shopId: z.string(),
  customerName: z.string(),
  customerEmail: z.string(),
  status: z.enum(["placed", "accepted", "ready", "completed", "cancelled"]),
  fulfillment: z.enum(["pickup"]),
  totalCents: z.number().int(),
  placedAt: z.string(),
  lines: z.array(
    z.object({ itemId: z.string(), name: z.string(), qty: z.number().int(), unitPriceCents: z.number().int() })
  ),
});
export type Order = z.infer<typeof orderSchema>;

export const inventoryItemSchema = z.object({
  id: z.string(),
  shopId: z.string(),
  sku: z.string(),
  label: z.string(),
  unit: z.string(),
  qty: z.number(),
  reorderPoint: z.number(),
  supplier: z.string(),
});
export type InventoryItem = z.infer<typeof inventoryItemSchema>;

export type DailyRevenue = { date: string; revenueCents: number; orders: number };
export type Bestseller = { item: MenuItem; units: number; revenueCents: number };
export type FlavorTrend = { tag: string; unitsLastWeek: number; unitsPrevWeek: number; wowPct: number };
export type ReorderSuggestion = { item: InventoryItem; daysLeft: number; dailyBurn: number };
