import { DashboardShell } from "@/components/dashboard/shell";
import { data, DEMO_SHOP_ID } from "@/lib/data";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const shop = await data.getShop(DEMO_SHOP_ID);
  return <DashboardShell shopName={shop?.name ?? "Your shop"}>{children}</DashboardShell>;
}
