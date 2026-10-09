import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCurrentShop, getCurrentUser } from "@/lib/auth/shop";
import { categoryLabels } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import { claimShop, createShop } from "./actions";

export const metadata = { title: "Set up your shop — Uncharted" };

export default async function OnboardingPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const shop = await getCurrentShop();
  if (shop) redirect("/dashboard");

  const supabase = await createClient();
  const { data: unclaimed } = await supabase
    .from("unclaimed_shops")
    .select("*")
    .order("name");

  return (
    <main className="flex min-h-screen flex-col items-center px-5 py-12">
      <Card className="w-full max-w-md p-6">
        <p className="font-mono text-[11px] font-bold uppercase text-main">
          Step 1 of 2
        </p>
        <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight">
          Create your shop
        </h1>
        <form action={createShop} className="mt-5 space-y-3">
          <div>
            <Label htmlFor="shop-name" className="font-mono text-[11px] font-bold uppercase text-muted-foreground">Shop name</Label>
            <Input id="shop-name" name="name" placeholder="Shop name" required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="address" className="font-mono text-[11px] font-bold uppercase text-muted-foreground">Address</Label>
            <Input id="address" name="address" placeholder="Street address" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="phone" className="font-mono text-[11px] font-bold uppercase text-muted-foreground">Phone</Label>
            <Input id="phone" name="phone" placeholder="Phone" className="mt-1" />
          </div>
          <Button type="submit" className="w-full">
            Continue →
          </Button>
        </form>
      </Card>

      <Card className="mt-6 w-full max-w-md p-6">
        <h2 className="font-display text-xl font-extrabold tracking-tight">
          Claim a listed shop
        </h2>
        <p className="mt-1 text-sm font-medium text-muted-foreground">
          Already on Uncharted? Claim your listing to take it over.
        </p>
        <div className="mt-4 space-y-2">
          {(unclaimed ?? []).map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between gap-3 rounded-base border-2 border-border bg-secondary-background px-3 py-2"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-bold">{s.name}</p>
                <p className="truncate font-mono text-[11px] font-bold text-muted-foreground">
                  {[s.address, s.city, s.state].filter(Boolean).join(", ")}
                </p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {(s.categories ?? []).map((c) => (
                    <Badge key={c} variant="neutral" className="font-mono text-[10px] font-bold uppercase">
                      {categoryLabels[c] ?? c}
                    </Badge>
                  ))}
                </div>
              </div>
              <form action={claimShop.bind(null, s.id!)}>
                <Button size="sm" type="submit">Claim</Button>
              </form>
            </div>
          ))}
          {(unclaimed ?? []).length === 0 && (
            <p className="py-2 text-sm font-medium text-muted-foreground">
              No unclaimed listings right now.
            </p>
          )}
        </div>
      </Card>
    </main>
  );
}
