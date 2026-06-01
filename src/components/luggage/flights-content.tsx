"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { PrimaryGrowButton, DestructiveGrowButton } from "@/components/ui/grow-button";
import { FlightSearchPanel } from "@/components/luggage/flight-search-panel";
import { PageShell, EmptyState } from "@/components/shared/page-shell";
import {
  getFlights,
  addFlight,
  removeFlight,
  type SavedFlight,
  type FlightClass,
} from "@/lib/luggage-state";

const CLASS_OPTIONS: { value: FlightClass; label: string }[] = [
  { value: "economy", label: "Economy" },
  { value: "business", label: "Business" },
  { value: "first", label: "First" },
];

export function FlightsContent() {
  const [flights, setFlights] = useState<SavedFlight[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [airline, setAirline] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [flightClass, setFlightClass] = useState<FlightClass>("economy");
  const [price, setPrice] = useState("");

  const refreshFlights = () => {
    setFlights(getFlights());
  };

  useEffect(() => {
    refreshFlights();
  }, []);

  const handleAdd = () => {
    if (!airline.trim() || !from.trim() || !to.trim()) return;
    const item = addFlight({
      airline: airline.trim(),
      from: from.trim().toUpperCase(),
      to: to.trim().toUpperCase(),
      flightClass,
      price: Number(price) || 0,
    });
    setFlights((prev) => [item, ...prev]);
    setAirline("");
    setFrom("");
    setTo("");
    setFlightClass("economy");
    setPrice("");
    setDialogOpen(false);
  };

  const handleRemove = (id: string) => {
    removeFlight(id);
    setFlights((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <PageShell
      title="Saved Flights"
      badge={flights.length}
      actions={
        <PrimaryGrowButton size="sm" className="font-departure-mono" onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Flight
        </PrimaryGrowButton>
      }
    >
      <FlightSearchPanel onSaved={refreshFlights} />

      {flights.length === 0 ? (
        <EmptyState message="No saved flights yet." />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-departure-mono">Airline</TableHead>
                <TableHead className="font-departure-mono">Route</TableHead>
                <TableHead className="font-departure-mono">Class</TableHead>
                <TableHead className="font-departure-mono text-right">Price</TableHead>
                <TableHead className="font-departure-mono w-[80px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {flights.map((flight) => (
                <TableRow key={flight.id}>
                  <TableCell className="font-wenkai-mono-bold">{flight.airline}</TableCell>
                  <TableCell className="font-departure-mono text-sm">
                    {flight.from} → {flight.to}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-departure-mono text-xs capitalize">
                      {flight.flightClass}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-departure-mono">
                    ${flight.price.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <DestructiveGrowButton
                      size="sm"
                      className="h-7 text-xs font-departure-mono"
                      onClick={() => handleRemove(flight.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </DestructiveGrowButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="font-departure-mono gap-4">
          <DialogHeader>
            <DialogTitle>Add Flight</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="font-departure-mono">Airline</Label>
              <Input
                value={airline}
                onChange={(e) => setAirline(e.target.value)}
                placeholder="e.g. Singapore Airlines"
                className="font-wenkai-mono-bold placeholder:font-wenkai-mono-bold"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="font-departure-mono">From</Label>
                <Input
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  placeholder="e.g. JFK"
                  className="font-wenkai-mono-bold placeholder:font-wenkai-mono-bold uppercase"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="font-departure-mono">To</Label>
                <Input
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="e.g. NRT"
                  className="font-wenkai-mono-bold placeholder:font-wenkai-mono-bold uppercase"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="font-departure-mono">Class</Label>
              <div className="flex gap-2">
                {CLASS_OPTIONS.map((opt) => (
                  <PrimaryGrowButton
                    key={opt.value}
                    size="sm"
                    className={`font-departure-mono text-xs ${flightClass === opt.value ? "bg-accent" : ""}`}
                    onClick={() => setFlightClass(opt.value)}
                  >
                    {opt.label}
                  </PrimaryGrowButton>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="font-departure-mono">Price ($)</Label>
              <Input
                value={price}
                onChange={(e) => setPrice(e.target.value.replace(/\D/g, ""))}
                placeholder="e.g. 1200"
                className="font-wenkai-mono-bold placeholder:font-wenkai-mono-bold"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <PrimaryGrowButton size="sm" onClick={() => setDialogOpen(false)} className="font-departure-mono">
              Cancel
            </PrimaryGrowButton>
            <PrimaryGrowButton
              size="sm"
              className="bg-green-600 text-white hover:bg-green-700 font-departure-mono"
              onClick={handleAdd}
            >
              Save
            </PrimaryGrowButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
