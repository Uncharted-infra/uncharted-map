import { OrdersQueue } from "@/components/dashboard/orders-queue";
import { data, DEMO_SHOP_ID } from "@/lib/data";

export default async function OrdersPage() {
  const orders = await data.getOrders(DEMO_SHOP_ID);

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
