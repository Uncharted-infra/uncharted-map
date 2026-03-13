"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
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
  getPlaces,
  addPlace,
  removePlace,
  type SavedPlace,
  type PlaceCategory,
} from "@/lib/luggage-state";

const CATEGORY_OPTIONS: { value: PlaceCategory; label: string }[] = [
  { value: "city", label: "City" },
  { value: "landmark", label: "Landmark" },
  { value: "nature", label: "Nature" },
];

export function PlacesContent() {
  const [places, setPlaces] = useState<SavedPlace[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [category, setCategory] = useState<PlaceCategory>("city");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    setPlaces(getPlaces());
  }, []);

  const handleAdd = () => {
    if (!name.trim() || !country.trim()) return;
    const item = addPlace({ name: name.trim(), country: country.trim(), category, notes: notes.trim() });
    setPlaces((prev) => [item, ...prev]);
    setName("");
    setCountry("");
    setCategory("city");
    setNotes("");
    setDialogOpen(false);
  };

  const handleRemove = (id: string) => {
    removePlace(id);
    setPlaces((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <PageShell
      title="Saved Places"
      badge={places.length}
      actions={
        <PrimaryGrowButton size="sm" className="font-departure-mono" onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Place
        </PrimaryGrowButton>
      }
    >
      {places.length === 0 ? (
        <EmptyState message="No saved places yet. Start exploring!" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {places.map((place) => (
            <Card key={place.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <CardTitle className="font-departure-mono text-sm truncate">
                      {place.name}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground font-departure-mono">{place.country}</p>
                  </div>
                  <Badge variant="outline" className="font-departure-mono text-xs shrink-0 capitalize">
                    {place.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                {place.notes && (
                  <p className="text-sm text-muted-foreground font-wenkai-mono-bold line-clamp-2">
                    {place.notes}
                  </p>
                )}
                <DestructiveGrowButton
                  size="sm"
                  className="h-7 text-xs font-departure-mono"
                  onClick={() => handleRemove(place.id)}
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
            <DialogTitle>Add Place</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="font-departure-mono">Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Santorini"
                className="font-wenkai-mono-bold placeholder:font-wenkai-mono-bold"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="font-departure-mono">Country</Label>
              <Input
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g. Greece"
                className="font-wenkai-mono-bold placeholder:font-wenkai-mono-bold"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="font-departure-mono">Category</Label>
              <div className="flex gap-2">
                {CATEGORY_OPTIONS.map((opt) => (
                  <PrimaryGrowButton
                    key={opt.value}
                    size="sm"
                    className={`font-departure-mono text-xs ${category === opt.value ? "bg-accent" : ""}`}
                    onClick={() => setCategory(opt.value)}
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
                placeholder="Why do you want to visit?"
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
