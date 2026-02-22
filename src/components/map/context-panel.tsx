"use client";

import { Map, Share2, FileDown, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const PLACEHOLDER_TRIP = {
  name: "Italy in September",
  dates: "Sep 12–17, 2025",
  travelers: 2,
  destination: "Rome, Florence, Venice",
  days: [
    { id: 1, title: "Day 1 — Arrival" },
    { id: 2, title: "Day 2 — Rome" },
    { id: 3, title: "Day 3 — Florence" },
  ],
  bookings: [
    { type: "Flight", detail: "JFK → FCO" },
    { type: "Hotel", detail: "Hotel Artemide, Rome" },
  ],
  budget: { estimated: 4200, paid: 1800 },
};

export function ContextPanel({ className }: { className?: string }) {
  return (
    <aside
      className={cn(
        "flex h-full w-[320px] shrink-0 flex-col border-l bg-muted/30",
        className
      )}
    >
      <ScrollArea className="flex-1">
        <div className="space-y-4 p-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="font-departure-mono text-sm font-medium">
                Trip Snapshot
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p className="font-departure-mono text-muted-foreground">Dates</p>
              <p>{PLACEHOLDER_TRIP.dates}</p>
              <p className="font-departure-mono text-muted-foreground mt-2">Travelers</p>
              <p>{PLACEHOLDER_TRIP.travelers}</p>
              <p className="font-departure-mono text-muted-foreground mt-2">Destination</p>
              <p>{PLACEHOLDER_TRIP.destination}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="font-departure-mono text-sm font-medium">
                Current Itinerary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {PLACEHOLDER_TRIP.days.map((day) => (
                  <li key={day.id}>
                    <button className="text-left text-sm w-full">
                      {day.title}
                    </button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="font-departure-mono text-sm font-medium">
                Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {PLACEHOLDER_TRIP.bookings.map((b, i) => (
                  <li key={i}>
                    <span className="font-departure-mono text-muted-foreground">{b.type}:</span>{" "}
                    {b.detail}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="font-departure-mono text-sm font-medium">
                Budget Tracker
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p>
                Estimated: <span className="font-departure-mono">${PLACEHOLDER_TRIP.budget.estimated.toLocaleString()}</span>
              </p>
              <p>
                Paid: <span className="font-departure-mono">${PLACEHOLDER_TRIP.budget.paid.toLocaleString()}</span>
              </p>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start gap-2" size="sm">
              <Share2 className="h-4 w-4" />
              Invite collaborators
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2" size="sm">
              <FileDown className="h-4 w-4" />
              Export itinerary PDF
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2" size="sm">
              <MessageCircle className="h-4 w-4" />
              Message Map about this trip
            </Button>
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
}
