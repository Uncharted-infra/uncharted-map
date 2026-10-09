// server-only: uses the Supabase server client (cookies) — do not import from client components.

import { cache } from "react";
import { redirect } from "next/navigation";
import { z } from "zod";
import { data } from "@/lib/data";
import type { Shop } from "@/lib/data";
import { shopSchema } from "@/lib/data/types";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";

const MOCK_SHOP_ID = "shop-butter-rye";
const hoursSchema = z.record(z.string(), z.string()).catch({});

export const getCurrentUser = cache(async () => {
  if (!hasSupabaseEnv()) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

export const getCurrentShop = cache(async (): Promise<Shop | null> => {
  if (!hasSupabaseEnv()) {
    return data.getShop(MOCK_SHOP_ID);
  }
  const user = await getCurrentUser();
  if (!user) return null;
  const supabase = await createClient();
  const { data: rows, error } = await supabase
    .from("shop_members")
    .select("shop_id, shops(*)")
    .eq("profile_id", user.id)
    .order("created_at")
    .limit(1);
  if (error) throw error;
  const row = rows[0];
  if (!row?.shops) return null;
  const s = row.shops;
  return shopSchema.parse({
    ...s,
    hours: hoursSchema.parse(s.hours),
  });
});

export async function requireShop(): Promise<Shop> {
  const user = await getCurrentUser();
  if (hasSupabaseEnv() && !user) redirect("/login");
  const shop = await getCurrentShop();
  if (!shop) redirect("/onboarding");
  return shop;
}
