// server-only: uses the Supabase server client (cookies) — do not import from client components.

import { cache } from "react";
import { redirect } from "next/navigation";
import { data } from "@/lib/data";
import type { Shop } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";

const MOCK_SHOP_ID = "shop-butter-rye";

export const getCurrentUser = cache(async () => {
  if (!hasSupabaseEnv()) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

export const getCurrentShop = cache(async (): Promise<Shop | null> => {
  return data.getShop(MOCK_SHOP_ID);
});

export async function requireShop(): Promise<Shop> {
  const user = await getCurrentUser();
  if (hasSupabaseEnv() && !user) redirect("/login");
  const shop = await getCurrentShop();
  if (!shop) throw new Error("Mock shop not found");
  return shop;
}
