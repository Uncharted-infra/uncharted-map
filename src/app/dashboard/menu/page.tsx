import { MenuList } from "@/components/dashboard/menu-list";
import { requireShop } from "@/lib/auth/shop";
import { data } from "@/lib/data";

export default async function MenuPage() {
  const shop = await requireShop();
  const items = await data.getMenu(shop.id);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-3xl font-extrabold tracking-tight">Menu</h1>
        <p className="mt-1 text-sm font-medium text-muted-foreground">
          Toggle availability — sold-out items disappear from the shop page instantly.
        </p>
      </div>
      <MenuList items={items} />
    </div>
  );
}
