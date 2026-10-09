import { DashboardShell } from "@/components/dashboard/shell";
import { requireShop } from "@/lib/auth/shop";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const shop = await requireShop();
  return <DashboardShell shop={shop}>{children}</DashboardShell>;
}
