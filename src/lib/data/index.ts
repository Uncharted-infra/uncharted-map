import { hasSupabaseEnv } from "@/lib/supabase/env";
import type {
  Bestseller,
  DailyRevenue,
  FlavorTrend,
  InventoryItem,
  MenuItem,
  Order,
  ReorderSuggestion,
  SalesDay,
  Shop,
} from "./types";
import { mockProvider } from "./mock";
import { supabaseProvider } from "./supabase";

export interface DataProvider {
  getShops(): Promise<Shop[]>;
  getShop(idOrSlug: string): Promise<Shop | null>;
  getMenu(shopId: string): Promise<MenuItem[]>;
  getSalesDaily(shopId: string, days?: number): Promise<SalesDay[]>;
  getDailyRevenue(shopId: string, days?: number): Promise<DailyRevenue[]>;
  getBestsellers(shopId: string, limit?: number): Promise<Bestseller[]>;
  getFlavorTrends(shopId: string | null, limit?: number): Promise<FlavorTrend[]>;
  getInventory(shopId: string): Promise<InventoryItem[]>;
  getReorderSuggestions(shopId: string): Promise<ReorderSuggestion[]>;
  getOrders(shopId: string): Promise<Order[]>;
  /** 7 rows (Sun–Sat) × 12 cols (7am–6pm) unit counts. */
  getDaypartHeat(shopId: string): Promise<number[][]>;
  updateOrderStatus(orderId: string, status: Order["status"]): Promise<void>;
  setMenuItemAvailability(itemId: string, available: boolean): Promise<void>;
  updateShop(
    shopId: string,
    patch: Partial<Pick<Shop, "name" | "story" | "phone" | "address" | "city" | "state">>
  ): Promise<void>;
}

export const data: DataProvider = hasSupabaseEnv() ? supabaseProvider : mockProvider;

export type {
  Bestseller,
  DailyRevenue,
  FlavorTrend,
  InventoryItem,
  MenuItem,
  Order,
  ReorderSuggestion,
  SalesDay,
  Shop,
} from "./types";
export { categoryLabels } from "./shops-seed";
