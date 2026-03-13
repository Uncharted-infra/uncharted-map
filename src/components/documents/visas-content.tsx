"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  getVisas,
  addVisa,
  removeVisa,
  computeVisaStatus,
  type Visa,
  type VisaType,
  type VisaStatus,
} from "@/lib/documents-state";

const VISA_TYPE_OPTIONS: { value: VisaType; label: string }[] = [
  { value: "tourist", label: "Tourist" },
  { value: "business", label: "Business" },
  { value: "transit", label: "Transit" },
];

const STATUS_STYLES: Record<VisaStatus, string> = {
  active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  expiring: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
  expired: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

const STATUS_LABELS: Record<VisaStatus, string> = {
  active: "Active",
  expiring: "Expiring Soon",
  expired: "Expired",
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function VisasContent() {
  const [visas, setVisas] = useState<Visa[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [country, setCountry] = useState("");
  const [flag, setFlag] = useState("");
  const [visaType, setVisaType] = useState<VisaType>("tourist");
  const [validFrom, setValidFrom] = useState("");
  const [validUntil, setValidUntil] = useState("");

  useEffect(() => {
    setVisas(getVisas());
  }, []);

  const handleAdd = () => {
    if (!country.trim() || !validFrom || !validUntil) return;
    const item = addVisa({
      country: country.trim(),
      flag: flag.trim() || "🌍",
      visaType,
      validFrom,
      validUntil,
    });
    setVisas((prev) => [item, ...prev]);
    setCountry("");
    setFlag("");
    setVisaType("tourist");
    setValidFrom("");
    setValidUntil("");
    setDialogOpen(false);
  };

  const handleRemove = (id: string) => {
    removeVisa(id);
    setVisas((prev) => prev.filter((v) => v.id !== id));
  };

  return (
    <PageShell
      title="Your Visas"
      badge={visas.length}
      actions={
        <PrimaryGrowButton size="sm" className="font-departure-mono" onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Visa
        </PrimaryGrowButton>
      }
    >
      {visas.length === 0 ? (
        <EmptyState message="No visas added yet." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visas.map((visa) => {
            const status = computeVisaStatus(visa);
            return (
              <Card key={visa.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="font-departure-mono text-sm flex items-center gap-2">
                      <span className="text-lg">{visa.flag}</span>
                      {visa.country}
                    </CardTitle>
                    <Badge className={`font-departure-mono text-xs shrink-0 border-0 ${STATUS_STYLES[status]}`}>
                      {STATUS_LABELS[status]}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 pt-0">
                  <Badge variant="outline" className="font-departure-mono text-xs capitalize">
                    {visa.visaType}
                  </Badge>
                  <div className="text-xs text-muted-foreground font-departure-mono">
                    {formatDate(visa.validFrom)} → {formatDate(visa.validUntil)}
                  </div>
                  <DestructiveGrowButton
                    size="sm"
                    className="h-7 text-xs font-departure-mono"
                    onClick={() => handleRemove(visa.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                    Remove
                  </DestructiveGrowButton>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="font-departure-mono gap-4">
          <DialogHeader>
            <DialogTitle>Add Visa</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-[1fr_80px] gap-3">
              <div className="space-y-1.5">
                <Label className="font-departure-mono">Country</Label>
                <Input
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. Japan"
                  className="font-wenkai-mono-bold placeholder:font-wenkai-mono-bold"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="font-departure-mono">Flag</Label>
                <Input
                  value={flag}
                  onChange={(e) => setFlag(e.target.value)}
                  placeholder="🇯🇵"
                  className="font-wenkai-mono-bold placeholder:font-wenkai-mono-bold text-center"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="font-departure-mono">Visa Type</Label>
              <div className="flex gap-2">
                {VISA_TYPE_OPTIONS.map((opt) => (
                  <PrimaryGrowButton
                    key={opt.value}
                    size="sm"
                    className={`font-departure-mono text-xs ${visaType === opt.value ? "bg-accent" : ""}`}
                    onClick={() => setVisaType(opt.value)}
                  >
                    {opt.label}
                  </PrimaryGrowButton>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="font-departure-mono">Valid From</Label>
                <Input
                  type="date"
                  value={validFrom}
                  onChange={(e) => setValidFrom(e.target.value)}
                  className="font-wenkai-mono-bold"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="font-departure-mono">Valid Until</Label>
                <Input
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  className="font-wenkai-mono-bold"
                />
              </div>
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
