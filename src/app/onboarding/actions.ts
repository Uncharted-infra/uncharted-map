"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createShop(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.rpc("create_shop", {
    p_name: String(formData.get("name") ?? ""),
    p_address: String(formData.get("address") ?? ""),
    p_phone: String(formData.get("phone") ?? ""),
  });
  if (error) throw error;
  redirect("/dashboard");
}

export async function claimShop(shopId: string) {
  const supabase = await createClient();
  const { error } = await supabase.rpc("claim_shop", { p_shop_id: shopId });
  if (error) throw error;
  redirect("/dashboard");
}
