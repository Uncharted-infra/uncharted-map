"use client";

import { useState, useEffect } from "react";
import { MapPin, Building2, UtensilsCrossed, Globe, Plane } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageShell, EmptyState } from "@/components/shared/page-shell";
import {
  getUpcomingTrips,
  getPastTrips,
  getPassportStats,
  type PassportTrip,
  type PassportStats,
} from "@/lib/passport-state";

function formatDateRange(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  return `${s.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${e.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
}

function TripCard({ trip }: { trip: PassportTrip }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="font-departure-mono text-sm truncate">
            {trip.destination}, {trip.country}
          </CardTitle>
          <Badge
            variant={trip.status === "upcoming" ? "default" : "secondary"}
            className="font-departure-mono text-xs shrink-0"
          >
            {trip.status === "upcoming" ? "Upcoming" : "Visited"}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground font-departure-mono">
          {formatDateRange(trip.startDate, trip.endDate)}
        </p>
      </CardHeader>
      <CardContent className="space-y-2 pt-0">
        <p className="text-sm font-wenkai-mono-bold text-muted-foreground truncate">
          🏨 {trip.hotel}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {trip.activities.slice(0, 3).map((a) => (
            <Badge key={a} variant="outline" className="font-departure-mono text-xs">
              {a}
            </Badge>
          ))}
          {trip.activities.length > 3 && (
            <Badge variant="outline" className="font-departure-mono text-xs">
              +{trip.activities.length - 3}
            </Badge>
          )}
        </div>
        {trip.notes && (
          <p className="text-xs text-muted-foreground font-wenkai-mono-bold line-clamp-2">
            {trip.notes}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: number }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-6">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="font-departure-mono text-3xl font-semibold">{value}</p>
          <p className="text-sm text-muted-foreground font-departure-mono">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function PassportContent() {
  const [upcoming, setUpcoming] = useState<PassportTrip[]>([]);
  const [past, setPast] = useState<PassportTrip[]>([]);
  const [stats, setStats] = useState<PassportStats | null>(null);

  useEffect(() => {
    setUpcoming(getUpcomingTrips());
    setPast(getPastTrips());
    setStats(getPassportStats());
  }, []);

  return (
    <PageShell title="Passport" description="Your travel history and upcoming adventures.">
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="font-departure-mono mb-6">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          {upcoming.length === 0 ? (
            <EmptyState message="No upcoming trips. Start planning your next adventure!" />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past">
          {past.length === 0 ? (
            <EmptyState message="No past trips yet. Your travel history will appear here." />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {past.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="stats">
          {stats ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard icon={Globe} label="Countries Visited" value={stats.countriesVisited} />
              <StatCard icon={Plane} label="Trips Taken" value={stats.tripsTaken} />
              <StatCard icon={Building2} label="Hotels Stayed" value={stats.hotelsStayed} />
              <StatCard icon={UtensilsCrossed} label="Restaurants Tried" value={stats.restaurantsTried} />
            </div>
          ) : (
            <EmptyState message="Loading stats..." />
          )}
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}
