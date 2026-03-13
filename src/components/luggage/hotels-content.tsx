"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { PrimaryGrowButton, DestructiveGrowButton } from "@/components/ui/grow-button";
import { PageShell, EmptyState } from "@/components/shared/page-shell";
import {
  getHotels,
  addHotel,
  removeHotel,
  type SavedHotel,
  type HotelPriceRange,
} from "@/lib/luggage-state";

const PRICE_OPTIONS: { value: HotelPriceRange; label: string }[] = [
  { value: "budget", label: "Budget" },
  { value: "standard", label: "Standard" },
  { value: "luxury", label: "Luxury" },
];

function StarRating({ stars, onSelect }: { stars: number; onSelect?: (n: number) => void }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onSelect?.(n)}
          className={onSelect ? "cursor-pointer" : "cursor-default"}
        >
          <Star
            className={`h-4 w-4 ${n <= stars ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`}
          />
        </button>
      ))}
    </div>
  );
}

export function HotelsContent() {
  const [hotels, setHotels] = useState<SavedHotel[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [stars, setStars] = useState(4);
  const [priceRange, setPriceRange] = useState<HotelPriceRange>("standard");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    setHotels(getHotels());
  }, []);

  const handleAdd = () => {
    if (!name.trim() || !location.trim()) return;
    const item = addHotel({
      name: name.trim(),
      location: location.trim(),
      stars,
      priceRange,
      notes: notes.trim(),
    });
    setHotels((prev) => [item, ...prev]);
    setName("");
    setLocation("");
    setStars(4);
    setPriceRange("standard");
    setNotes("");
    setDialogOpen(false);
  };

  const handleRemove = (id: string) => {
    removeHotel(id);
    setHotels((prev) => prev.filter((h) => h.id !== id));
  };

  return (
    <PageShell
      title="Saved Hotels"
      badge={hotels.length}
      actions={
        <PrimaryGrowButton size="sm" className="font-departure-mono" onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Hotel
        </PrimaryGrowButton>
      }
    >
      {hotels.length === 0 ? (
        <EmptyState message="No saved hotels yet." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {hotels.map((hotel) => (
            <Card key={hotel.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <CardTitle className="font-departure-mono text-sm truncate">
                      {hotel.name}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground font-departure-mono">{hotel.location}</p>
                  </div>
                  <Badge variant="outline" className="font-departure-mono text-xs shrink-0 capitalize">
                    {hotel.priceRange}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                <StarRating stars={hotel.stars} />
                {hotel.notes && (
                  <p className="text-sm text-muted-foreground font-wenkai-mono-bold line-clamp-2">
                    {hotel.notes}
                  </p>
                )}
                <DestructiveGrowButton
                  size="sm"
                  className="h-7 text-xs font-departure-mono"
                  onClick={() => handleRemove(hotel.id)}
                >
                  <Trash2 className="h-3 w-3" />
                  Remove
                </DestructiveGrowButton>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="font-departure-mono gap-4">
          <DialogHeader>
            <DialogTitle>Add Hotel</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="font-departure-mono">Hotel Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Aman Tokyo"
                className="font-wenkai-mono-bold placeholder:font-wenkai-mono-bold"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="font-departure-mono">Location</Label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Tokyo, Japan"
                className="font-wenkai-mono-bold placeholder:font-wenkai-mono-bold"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="font-departure-mono">Star Rating</Label>
              <StarRating stars={stars} onSelect={setStars} />
            </div>
            <div className="space-y-1.5">
              <Label className="font-departure-mono">Price Range</Label>
              <div className="flex gap-2">
                {PRICE_OPTIONS.map((opt) => (
                  <PrimaryGrowButton
                    key={opt.value}
                    size="sm"
                    className={`font-departure-mono text-xs ${priceRange === opt.value ? "bg-accent" : ""}`}
                    onClick={() => setPriceRange(opt.value)}
                  >
                    {opt.label}
                  </PrimaryGrowButton>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="font-departure-mono">Notes</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What makes this hotel special?"
                className="font-wenkai-mono-bold placeholder:font-wenkai-mono-bold resize-none"
                rows={3}
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
