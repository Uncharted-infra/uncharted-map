"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireShop } from "@/lib/auth/shop";
import { data } from "@/lib/data";
import type { Order } from "@/lib/data";

export async function advanceOrderAction(orderId: string, status: Order["status"]) {
  await requireShop();
  await data.updateOrderStatus(orderId, status);
  revalidatePath("/dashboard/orders");
  revalidatePath("/dashboard");
}

export async function toggleAvailabilityAction(itemId: string, available: boolean) {
  await requireShop();
  await data.setMenuItemAvailability(itemId, available);
  revalidatePath("/dashboard/menu");
}

export async function updateShopAction(formData: FormData) {
  const shop = await requireShop();
  await data.updateShop(shop.id, {
    name: String(formData.get("name") ?? ""),
    story: String(formData.get("story") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    address: String(formData.get("address") ?? ""),
    city: String(formData.get("city") ?? ""),
    state: String(formData.get("state") ?? ""),
  });
  revalidatePath("/dashboard/settings");
  redirect("/dashboard/settings?saved=1");
}
