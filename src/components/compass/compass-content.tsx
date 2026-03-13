"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SecondaryGrowButton } from "@/components/ui/grow-button";
import { PageShell, EmptyState } from "@/components/shared/page-shell";
import { COMPASS_PLANS, type CompassPlan } from "@/data/compass";

export function CompassContent() {
  const [search, setSearch] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<CompassPlan | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return COMPASS_PLANS;
    const q = search.toLowerCase();
    return COMPASS_PLANS.filter(
      (p) =>
        p.destination.toLowerCase().includes(q) ||
        p.country.toLowerCase().includes(q) ||
        p.travelerName.toLowerCase().includes(q) ||
        p.activities.some((a) => a.toLowerCase().includes(q))
    );
  }, [search]);

  return (
    <PageShell title="Compass" description="Explore other travelers' plans for inspiration.">
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by destination, traveler, or activity..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 font-wenkai-mono-bold placeholder:font-wenkai-mono-bold"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState message="No travel plans found. Try a different search." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((plan) => (
            <Card key={plan.id} className="flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarFallback className="bg-primary/20 text-primary text-xs font-medium font-departure-mono">
                      {plan.travelerInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <CardTitle className="font-departure-mono text-sm truncate">
                      {plan.travelerName}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground font-departure-mono truncate">
                      {plan.dateRange}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-3 pt-0">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="font-departure-mono">
                    {plan.destination}, {plan.country}
                  </Badge>
                </div>
                <div className="space-y-1 text-sm font-wenkai-mono-bold text-muted-foreground">
                  <p className="truncate">🏨 {plan.hotel}</p>
                  <p className="truncate">✈️ {plan.flight}</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {plan.activities.slice(0, 3).map((a) => (
                    <Badge key={a} variant="outline" className="font-departure-mono text-xs">
                      {a}
                    </Badge>
                  ))}
                  {plan.activities.length > 3 && (
                    <Badge variant="outline" className="font-departure-mono text-xs">
                      +{plan.activities.length - 3}
                    </Badge>
                  )}
                </div>
                <div className="mt-auto pt-2">
                  <SecondaryGrowButton
                    size="sm"
                    className="w-full font-departure-mono"
                    onClick={() => setSelectedPlan(plan)}
                  >
                    View Plan
                  </SecondaryGrowButton>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!selectedPlan} onOpenChange={() => setSelectedPlan(null)}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          {selectedPlan && (
            <>
              <DialogHeader>
                <DialogTitle className="font-departure-mono">
                  {selectedPlan.destination}, {selectedPlan.country}
                </DialogTitle>
                <p className="text-sm text-muted-foreground font-departure-mono">
                  {selectedPlan.travelerName} · {selectedPlan.dateRange}
                </p>
              </DialogHeader>
              <div className="space-y-3 mt-4">
                <div className="space-y-1 text-sm font-wenkai-mono-bold">
                  <p>🏨 {selectedPlan.hotel}</p>
                  <p>✈️ {selectedPlan.flight}</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedPlan.activities.map((a) => (
                    <Badge key={a} variant="outline" className="font-departure-mono text-xs">
                      {a}
                    </Badge>
                  ))}
                </div>
                <div className="border-t border-border pt-3 mt-3">
                  <h3 className="font-departure-mono text-sm font-semibold mb-3">Itinerary</h3>
                  <div className="space-y-3">
                    {selectedPlan.itinerary.map((day) => (
                      <div key={day.day} className="flex gap-3">
                        <div className="shrink-0 w-16 text-xs font-departure-mono text-muted-foreground pt-0.5">
                          Day {day.day}
                        </div>
                        <p className="text-sm font-wenkai-mono-bold">{day.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
