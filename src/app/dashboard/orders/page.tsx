import { OrdersQueue } from "@/components/dashboard/orders-queue";
import { requireShop } from "@/lib/auth/shop";
import { data } from "@/lib/data";

export default async function OrdersPage() {
  const shop = await requireShop();
  const orders = await data.getOrders(shop.id);

  return (
    <div>
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight">Orders</h1>
          <p className="mt-1 text-sm font-medium text-muted-foreground">Today&apos;s pickup queue.</p>
        </div>
        <span className="font-mono text-[11px] font-bold uppercase text-muted-foreground">
          {orders.filter((o) => o.status === "placed").length} new
        </span>
      </div>
      <OrdersQueue initialOrders={orders} />
    </div>
  );
}
