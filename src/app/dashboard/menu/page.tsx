import { MenuList } from "@/components/dashboard/menu-list";
import { data, DEMO_SHOP_ID } from "@/lib/data";

export default async function MenuPage() {
  const items = await data.getMenu(DEMO_SHOP_ID);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-3xl font-medium tracking-tight">Menu</h1>
        <p className="mt-1 text-sm text-muted">
          Toggle availability — sold-out items disappear from the shop page instantly.
        </p>
      </div>
      <MenuList items={items} />
    </div>
  );
}
