"use client";

import { useState } from "react";
import { ExternalLink, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PrimaryGrowButton } from "@/components/ui/grow-button";
import {
  inventorySearch,
  pollInventorySearch,
} from "@/lib/inventory/graphql-client";
import type { CabinClass, FlightOffer } from "@/lib/inventory/types";
import { addFlight, type FlightClass } from "@/lib/luggage-state";

const CABIN_OPTIONS: { value: CabinClass; label: string }[] = [
  { value: "ECONOMY", label: "Economy" },
  { value: "BUSINESS", label: "Business" },
  { value: "FIRST", label: "First" },
];

function mapCabinToFlightClass(cabin: CabinClass): FlightClass {
  if (cabin === "FIRST") return "first";
  if (cabin === "BUSINESS") return "business";
  return "economy";
}

interface FlightSearchPanelProps {
  onSaved?: () => void;
}

export function FlightSearchPanel({ onSaved }: FlightSearchPanelProps) {
  const [origin, setOrigin] = useState("JFK");
  const [destination, setDestination] = useState("LIS");
  const [departDate, setDepartDate] = useState("2026-06-13");
  const [adults, setAdults] = useState("1");
  const [cabin, setCabin] = useState<CabinClass>("ECONOMY");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [offers, setOffers] = useState<FlightOffer[]>([]);

  const handleSearch = async () => {
    if (!origin.trim() || !destination.trim() || !departDate.trim()) return;

    setLoading(true);
    setError(null);
    setOffers([]);
    setStatus("Searching…");

    try {
      const initial = await inventorySearch("FLIGHTS", {
        origin: origin.trim(),
        destination: destination.trim(),
        departDate: departDate.trim(),
        adults: Number(adults) || 1,
        cabin,
      });

      setStatus(initial.status);

      let result = initial;
      if (initial.status === "STARTED" || initial.status === "PARTIAL") {
        const polled = await pollInventorySearch(initial.searchId);
        if (polled) result = polled;
      }

      setStatus(result.status);
      if (result.error) {
        setError(result.error.message);
      }
      setOffers(result.flightOffers);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveOffer = (offer: FlightOffer) => {
    addFlight({
      airline: offer.airline,
      from: offer.origin,
      to: offer.destination,
      flightClass: mapCabinToFlightClass(offer.cabin),
      price: Math.round(offer.price.amount),
    });
    onSaved?.();
  };

  return (
    <div className="space-y-4 rounded-md border p-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-departure-mono text-sm font-medium">Live flight search</h2>
        {status ? (
          <Badge variant="outline" className="font-departure-mono text-xs">
            {status}
          </Badge>
        ) : null}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-1.5">
          <Label className="font-departure-mono text-xs">From</Label>
          <Input
            value={origin}
            onChange={(e) => setOrigin(e.target.value.toUpperCase())}
            className="font-wenkai-mono-bold uppercase"
            placeholder="JFK"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="font-departure-mono text-xs">To</Label>
          <Input
            value={destination}
            onChange={(e) => setDestination(e.target.value.toUpperCase())}
            className="font-wenkai-mono-bold uppercase"
            placeholder="LIS"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="font-departure-mono text-xs">Depart</Label>
          <Input
            type="date"
            value={departDate}
            onChange={(e) => setDepartDate(e.target.value)}
            className="font-departure-mono"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="font-departure-mono text-xs">Adults</Label>
          <Input
            value={adults}
            onChange={(e) => setAdults(e.target.value.replace(/\D/g, ""))}
            className="font-departure-mono"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {CABIN_OPTIONS.map((opt) => (
          <PrimaryGrowButton
            key={opt.value}
            size="sm"
            className={`font-departure-mono text-xs ${cabin === opt.value ? "bg-accent" : ""}`}
            onClick={() => setCabin(opt.value)}
          >
            {opt.label}
          </PrimaryGrowButton>
        ))}
        <PrimaryGrowButton
          size="sm"
          className="ml-auto bg-green-600 font-departure-mono text-white hover:bg-green-700"
          onClick={handleSearch}
          disabled={loading}
        >
          <Search className="h-4 w-4" />
          {loading ? "Searching…" : "Search flights"}
        </PrimaryGrowButton>
      </div>

      {error ? (
        <p className="font-departure-mono text-sm text-destructive">{error}</p>
      ) : null}

      {offers.length > 0 ? (
        <ul className="divide-y rounded-md border">
          {offers.map((offer) => (
            <li key={offer.id} className="flex flex-wrap items-center gap-3 p-3">
              <div className="min-w-0 flex-1">
                <p className="font-wenkai-mono-bold">{offer.airline}</p>
                <p className="font-departure-mono text-xs text-muted-foreground">
                  {offer.origin} → {offer.destination}
                  {offer.stops > 0 ? ` · ${offer.stops} stop${offer.stops > 1 ? "s" : ""}` : " · nonstop"}
                </p>
              </div>
              <p className="font-departure-mono text-sm">
                {offer.price.currency} {offer.price.amount.toLocaleString()}
              </p>
              <div className="flex gap-2">
                {offer.deepLink ? (
                  <PrimaryGrowButton size="sm" className="font-departure-mono text-xs" asChild>
                    <a href={offer.deepLink} target="_blank" rel="noreferrer">
                      <ExternalLink className="h-3 w-3" />
                      Assist
                    </a>
                  </PrimaryGrowButton>
                ) : null}
                <PrimaryGrowButton
                  size="sm"
                  className="font-departure-mono text-xs"
                  onClick={() => handleSaveOffer(offer)}
                >
                  Save
                </PrimaryGrowButton>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
