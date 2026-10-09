import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateShopAction } from "@/app/dashboard/actions";
import { requireShop } from "@/lib/auth/shop";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const [{ saved }, shop] = await Promise.all([searchParams, requireShop()]);

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-3xl font-extrabold tracking-tight">Settings</h1>
      <p className="mt-1 text-sm font-medium text-muted-foreground">Your shop, as customers see it.</p>

      <Card className="mt-6 p-5">
        <form action={updateShopAction} className="space-y-4">
          <div>
            <Label htmlFor="name" className="font-mono text-[11px] font-bold uppercase text-muted-foreground">Shop name</Label>
            <Input id="name" name="name" defaultValue={shop.name} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="story" className="font-mono text-[11px] font-bold uppercase text-muted-foreground">Story</Label>
            <textarea
              id="story"
              name="story"
              defaultValue={shop.story}
              rows={3}
              className="mt-1 flex w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 text-sm font-medium focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:outline-hidden"
            />
          </div>
          <div>
            <Label htmlFor="phone" className="font-mono text-[11px] font-bold uppercase text-muted-foreground">Phone</Label>
            <Input id="phone" name="phone" defaultValue={shop.phone} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="address" className="font-mono text-[11px] font-bold uppercase text-muted-foreground">Address</Label>
            <Input id="address" name="address" defaultValue={shop.address} className="mt-1" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="city" className="font-mono text-[11px] font-bold uppercase text-muted-foreground">City</Label>
              <Input id="city" name="city" defaultValue={shop.city} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="state" className="font-mono text-[11px] font-bold uppercase text-muted-foreground">State</Label>
              <Input id="state" name="state" defaultValue={shop.state} className="mt-1" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button type="submit">Save changes</Button>
            {saved === "1" && (
              <span className="rounded-base border-2 border-border bg-blue px-1.5 font-mono text-[11px] font-bold uppercase">Saved</span>
            )}
          </div>
          <p className="font-mono text-[11px] font-bold text-muted-foreground">Payouts and team members arrive with payments.</p>
        </form>
      </Card>
    </div>
  );
}
