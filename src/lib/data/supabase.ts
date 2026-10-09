import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import {
  computeBestsellers,
  computeDailyRevenue,
  computeDaypartHeat,
  computeFlavorTrends,
  computeReorderSuggestions,
  lastNDates,
} from "./compute";
import type { DataProvider } from "./index";
import {
  inventoryItemSchema,
  menuItemSchema,
  orderSchema,
  salesDaySchema,
  shopSchema,
  type FlavorTrend,
  type InventoryItem,
  type MenuItem,
  type Order,
  type SalesDay,
  type Shop,
} from "./types";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const hoursSchema = z.record(z.string(), z.string()).catch({});

function toShop(row: Record<string, unknown>): Shop {
  return shopSchema.parse({
    id: row.id,
    slug: row.slug,
    name: row.name,
    categories: row.categories,
    story: row.story,
    phone: row.phone,
    address: row.address,
    city: row.city,
    state: row.state,
    lat: row.lat,
    lng: row.lng,
    hours: hoursSchema.parse(row.hours),
    photo: row.photo,
    status: row.status,
  });
}

function toMenuItem(row: Record<string, unknown>): MenuItem {
  return menuItemSchema.parse({
    id: row.id,
    shopId: row.shop_id,
    name: row.name,
    description: row.description,
    priceCents: row.price_cents,
    category: row.category,
    flavorTags: row.flavor_tags,
    photo: row.photo,
    available: row.available,
    bestseller: row.bestseller,
  });
}

function toSalesDay(row: Record<string, unknown>): SalesDay {
  return salesDaySchema.parse({
    shopId: row.shop_id,
    date: row.date,
    itemId: row.item_id,
    units: row.units,
    revenueCents: row.revenue_cents,
  });
}

function toInventoryItem(row: Record<string, unknown>): InventoryItem {
  return inventoryItemSchema.parse({
    id: row.id,
    shopId: row.shop_id,
    sku: row.sku,
    label: row.label,
    unit: row.unit,
    qty: row.qty,
    reorderPoint: row.reorder_point,
    supplier: row.supplier,
  });
}

function toOrder(row: Record<string, unknown>): Order {
  const items = (row.order_items as Record<string, unknown>[] | null) ?? [];
  return orderSchema.parse({
    id: row.id,
    shopId: row.shop_id,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    status: row.status,
    fulfillment: row.fulfillment,
    totalCents: row.total_cents,
    placedAt: row.placed_at,
    lines: items.map((l) => ({
      itemId: (l.item_id as string | null) ?? "",
      name: l.name,
      qty: l.qty,
      unitPriceCents: l.unit_price_cents,
    })),
  });
}

async function menuItemsFor(shopId: string): Promise<MenuItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .eq("shop_id", shopId)
    .order("sort")
    .order("name");
  if (error) throw error;
  return data.map(toMenuItem);
}

async function inventoryFor(shopId: string): Promise<InventoryItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("inventory")
    .select("*")
    .eq("shop_id", shopId)
    .order("sku");
  if (error) throw error;
  return data.map(toInventoryItem);
}

async function salesRows(shopId: string, days: number): Promise<SalesDay[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sales_daily")
    .select("*")
    .eq("shop_id", shopId)
    .gte("date", lastNDates(days)[0]);
  if (error) throw error;
  return data.map(toSalesDay);
}

export const supabaseProvider: DataProvider = {
  async getShops() {
    const supabase = await createClient();
    const { data, error } = await supabase.from("shops").select("*").order("name");
    if (error) throw error;
    return data.map(toShop);
  },
  async getShop(idOrSlug) {
    const supabase = await createClient();
    const query = supabase.from("shops").select("*").limit(1);
    const { data, error } = UUID_RE.test(idOrSlug)
      ? await query.or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`)
      : await query.eq("slug", idOrSlug);
    if (error) throw error;
    return data[0] ? toShop(data[0]) : null;
  },
  async getMenu(shopId) {
    return menuItemsFor(shopId);
  },
  async getSalesDaily(shopId, days = 90) {
    return salesRows(shopId, days);
  },
  async getDailyRevenue(shopId, days = 7) {
    const rows = await salesRows(shopId, days);
    return computeDailyRevenue(rows, days);
  },
  async getBestsellers(shopId, limit = 5) {
    const [rows, items] = await Promise.all([salesRows(shopId, 30), menuItemsFor(shopId)]);
    return computeBestsellers(rows, items, limit);
  },
  async getFlavorTrends(shopId, limit = 8) {
    const supabase = await createClient();
    if (shopId === null) {
      const { data, error } = await supabase.rpc("network_flavor_trends");
      if (error) throw error;
      return data
        .filter((t) => t.units_last_week + t.units_prev_week >= 20)
        .map(
          (t): FlavorTrend => ({
            tag: t.tag,
            unitsLastWeek: t.units_last_week,
            unitsPrevWeek: t.units_prev_week,
            wowPct:
              t.units_prev_week === 0
                ? 100
                : Math.round(((t.units_last_week - t.units_prev_week) / t.units_prev_week) * 100),
          })
        )
        .sort((a, b) => b.wowPct - a.wowPct)
        .slice(0, limit);
    }
    const [rows, items] = await Promise.all([salesRows(shopId, 14), menuItemsFor(shopId)]);
    return computeFlavorTrends(rows, items, limit);
  },
  async getInventory(shopId) {
    return inventoryFor(shopId);
  },
  async getReorderSuggestions(shopId) {
    const [rows, inventory] = await Promise.all([
      salesRows(shopId, 14),
      inventoryFor(shopId),
    ]);
    return computeReorderSuggestions(inventory, rows);
  },
  async getOrders(shopId) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("shop_id", shopId)
      .order("placed_at", { ascending: false });
    if (error) throw error;
    return data.map(toOrder);
  },
  async getDaypartHeat(shopId) {
    return computeDaypartHeat(shopId);
  },
  async updateOrderStatus(orderId, status) {
    const supabase = await createClient();
    const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
    if (error) throw error;
  },
  async setMenuItemAvailability(itemId, available) {
    const supabase = await createClient();
    const { error } = await supabase
      .from("menu_items")
      .update({ available })
      .eq("id", itemId);
    if (error) throw error;
  },
  async updateShop(shopId, patch) {
    const supabase = await createClient();
    const update: {
      name?: string;
      story?: string;
      phone?: string;
      address?: string;
      city?: string;
      state?: string;
    } = {};
    if (patch.name !== undefined) update.name = patch.name;
    if (patch.story !== undefined) update.story = patch.story;
    if (patch.phone !== undefined) update.phone = patch.phone;
    if (patch.address !== undefined) update.address = patch.address;
    if (patch.city !== undefined) update.city = patch.city;
    if (patch.state !== undefined) update.state = patch.state;
    const { error } = await supabase.from("shops").update(update).eq("id", shopId);
    if (error) throw error;
  },
};
