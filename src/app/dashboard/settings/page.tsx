import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { data, DEMO_SHOP_ID } from "@/lib/data";

export default async function SettingsPage() {
  const shop = await data.getShop(DEMO_SHOP_ID);
  if (!shop) return null;

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-3xl font-medium tracking-tight">Settings</h1>
      <p className="mt-1 text-sm text-muted">Your shop, as customers see it.</p>

      <Card className="mt-6 space-y-4 p-5">
        <div>
          <label className="font-mono text-[11px] tracking-wide uppercase text-muted">Shop name</label>
          <Input defaultValue={shop.name} className="mt-1" />
        </div>
        <div>
          <label className="font-mono text-[11px] tracking-wide uppercase text-muted">Story</label>
          <textarea
            defaultValue={shop.story}
            rows={3}
            className="mt-1 w-full rounded-xl border border-line bg-white px-4 py-3 text-ink focus:border-caramel focus:outline-none"
          />
        </div>
        <div>
          <label className="font-mono text-[11px] tracking-wide uppercase text-muted">Phone</label>
          <Input defaultValue={shop.phone} className="mt-1" />
        </div>
        <div>
          <label className="font-mono text-[11px] tracking-wide uppercase text-muted">Address</label>
          <Input defaultValue={`${shop.address}, ${shop.city}, ${shop.state}`} className="mt-1" />
        </div>
        <Button>Save changes</Button>
        <p className="font-mono text-[11px] text-muted">Payouts and team members arrive with payments.</p>
      </Card>
    </div>
  );
}
