import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { data, DEMO_SHOP_ID } from "@/lib/data";

export default async function SettingsPage() {
  const shop = await data.getShop(DEMO_SHOP_ID);
  if (!shop) return null;

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-3xl font-extrabold tracking-tight">Settings</h1>
      <p className="mt-1 text-sm font-medium text-muted-foreground">Your shop, as customers see it.</p>

      <Card className="mt-6 space-y-4 p-5">
        <div>
          <Label className="font-mono text-[11px] font-bold uppercase text-muted-foreground">Shop name</Label>
          <Input defaultValue={shop.name} className="mt-1" />
        </div>
        <div>
          <Label className="font-mono text-[11px] font-bold uppercase text-muted-foreground">Story</Label>
          <textarea
            defaultValue={shop.story}
            rows={3}
            className="mt-1 flex w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 text-sm font-medium focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:outline-hidden"
          />
        </div>
        <div>
          <Label className="font-mono text-[11px] font-bold uppercase text-muted-foreground">Phone</Label>
          <Input defaultValue={shop.phone} className="mt-1" />
        </div>
        <div>
          <Label className="font-mono text-[11px] font-bold uppercase text-muted-foreground">Address</Label>
          <Input defaultValue={`${shop.address}, ${shop.city}, ${shop.state}`} className="mt-1" />
        </div>
        <Button>Save changes</Button>
        <p className="font-mono text-[11px] font-bold text-muted-foreground">Payouts and team members arrive with payments.</p>
      </Card>
    </div>
  );
}
