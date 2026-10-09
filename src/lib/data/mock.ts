import { seedInventoryFor, seedOrdersFor, seedSalesDaily } from "./analytics-seed";
import {
  computeBestsellers,
  computeDailyRevenue,
  computeDaypartHeat,
  computeFlavorTrends,
  computeReorderSuggestions,
  lastNDates,
} from "./compute";
import { seedMenuItems, seedShops } from "./shops-seed";
import type { DataProvider } from "./index";
import type { Order, Shop } from "./types";

// Module-level mutable state so writes persist in-process for the dev session.
const shops: Shop[] = seedShops;
const menuItems = seedMenuItems;
const ordersByShop = new Map<string, Order[]>();

function ordersFor(shopId: string): Order[] {
  let orders = ordersByShop.get(shopId);
  if (!orders) {
    orders = seedOrdersFor(shopId);
    ordersByShop.set(shopId, orders);
  }
  return orders;
}

export const mockProvider: DataProvider = {
  async getShops() {
    return shops;
  },
  async getShop(idOrSlug) {
    return shops.find((s) => s.id === idOrSlug || s.slug === idOrSlug) ?? null;
  },
  async getMenu(shopId) {
    return menuItems.filter((m) => m.shopId === shopId);
  },
  async getSalesDaily(shopId, days = 90) {
    const cutoff = lastNDates(days)[0];
    return seedSalesDaily.filter((r) => r.shopId === shopId && r.date >= cutoff);
  },
  async getDailyRevenue(shopId, days = 7) {
    const cutoff = lastNDates(days)[0];
    const rows = seedSalesDaily.filter((r) => r.shopId === shopId && r.date >= cutoff);
    return computeDailyRevenue(rows, days);
  },
  async getBestsellers(shopId, limit = 5) {
    const cutoff = lastNDates(30)[0];
    const rows = seedSalesDaily.filter((r) => r.shopId === shopId && r.date >= cutoff);
    return computeBestsellers(rows, menuItems, limit);
  },
  async getFlavorTrends(shopId, limit = 8) {
    const rows = shopId
      ? seedSalesDaily.filter((r) => r.shopId === shopId)
      : seedSalesDaily;
    return computeFlavorTrends(rows, menuItems, limit);
  },
  async getInventory(shopId) {
    return seedInventoryFor(shopId);
  },
  async getReorderSuggestions(shopId) {
    const cutoff = lastNDates(14)[0];
    const rows = seedSalesDaily.filter((r) => r.shopId === shopId && r.date >= cutoff);
    return computeReorderSuggestions(seedInventoryFor(shopId), rows);
  },
  async getOrders(shopId) {
    return ordersFor(shopId);
  },
  async getDaypartHeat(shopId) {
    return computeDaypartHeat(shopId);
  },
  async updateOrderStatus(orderId, status) {
    for (const orders of ordersByShop.values()) {
      const order = orders.find((o) => o.id === orderId);
      if (order) {
        order.status = status;
        return;
      }
    }
  },
  async setMenuItemAvailability(itemId, available) {
    const item = menuItems.find((m) => m.id === itemId);
    if (item) item.available = available;
  },
  async updateShop(shopId, patch) {
    const shop = shops.find((s) => s.id === shopId);
    if (shop) Object.assign(shop, patch);
  },
};
