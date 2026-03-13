"use client";

import { useState, useEffect } from "react";
import { Clock, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PageShell, EmptyState } from "@/components/shared/page-shell";
import {
  getItineraries,
  type Itinerary,
} from "@/lib/documents-state";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ItineraryContent() {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const data = getItineraries();
    setItineraries(data);
    if (data.length > 0) setSelectedId(data[0].id);
  }, []);

  const itinerary = itineraries.find((i) => i.id === selectedId) ?? null;
  const budgetPercent = itinerary
    ? Math.round((itinerary.budgetSpent / itinerary.budgetTotal) * 100)
    : 0;

  return (
    <PageShell title="Itinerary">
      {itineraries.length > 1 && (
        <div className="mb-6">
          <select
            value={selectedId ?? ""}
            onChange={(e) => setSelectedId(e.target.value)}
            className="w-full max-w-xs rounded-md border border-input bg-background px-3 py-2 text-sm font-departure-mono focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {itineraries.map((it) => (
              <option key={it.id} value={it.id}>
                {it.destination}
              </option>
            ))}
          </select>
        </div>
      )}

      {!itinerary ? (
        <EmptyState message="No itinerary yet. Start planning a trip!" />
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="font-departure-mono text-lg">
                {itinerary.destination}
              </CardTitle>
              <p className="text-sm text-muted-foreground font-departure-mono">
                {formatDate(itinerary.startDate)} – {formatDate(itinerary.endDate)}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-departure-mono text-muted-foreground">Travelers:</span>
                <div className="flex -space-x-2">
                  {itinerary.travelers.map((t) => (
                    <Avatar key={t.initials} className="h-7 w-7 border-2 border-background">
                      <AvatarFallback className="bg-primary/20 text-primary text-[10px] font-medium font-departure-mono">
                        {t.initials}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <span className="text-xs text-muted-foreground font-wenkai-mono-bold">
                  {itinerary.travelers.map((t) => t.name).join(", ")}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-departure-mono text-muted-foreground">Hotel:</span>
                <span className="text-sm font-wenkai-mono-bold">{itinerary.hotel}</span>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-departure-mono text-muted-foreground">Budget</span>
                  <span className="font-departure-mono">
                    ${itinerary.budgetSpent.toLocaleString()} / ${itinerary.budgetTotal.toLocaleString()}
                  </span>
                </div>
                <Progress value={budgetPercent} className="h-2" />
                <p className="text-xs text-muted-foreground font-departure-mono text-right">
                  {budgetPercent}% spent
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h2 className="font-departure-mono text-lg font-semibold">Day-by-Day</h2>
            <div className="relative space-y-6 pl-6 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-px before:bg-border">
              {itinerary.days.map((day) => (
                <div key={day.day} className="relative">
                  <div className="absolute -left-6 top-0.5 h-3.5 w-3.5 rounded-full border-2 border-primary bg-background" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="font-departure-mono text-xs">
                        Day {day.day}
                      </Badge>
                      <span className="text-xs text-muted-foreground font-departure-mono">
                        {formatDate(day.date)}
                      </span>
                    </div>
                    <div className="space-y-2 mt-2">
                      {day.activities.map((activity, i) => (
                        <Card key={i} className="bg-muted/30">
                          <CardContent className="p-3 space-y-1">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1 text-xs text-muted-foreground font-departure-mono shrink-0">
                                <Clock className="h-3 w-3" />
                                {activity.time}
                              </div>
                              <span className="text-sm font-departure-mono font-medium truncate">
                                {activity.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground font-wenkai-mono-bold">
                              <MapPin className="h-3 w-3 shrink-0" />
                              {activity.location}
                            </div>
                            {activity.notes && (
                              <p className="text-xs text-muted-foreground font-wenkai-mono-bold">
                                {activity.notes}
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}
