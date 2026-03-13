"use client";

import { useState, useEffect, useMemo } from "react";
import { Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SecondaryGrowButton } from "@/components/ui/grow-button";
import { PageShell, EmptyState } from "@/components/shared/page-shell";
import {
  getReceipts,
  getItineraries,
  type Receipt,
  type Itinerary,
} from "@/lib/documents-state";

const CATEGORY_COLORS: Record<string, string> = {
  flight: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  hotel: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  food: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  activity: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  transport: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300",
  other: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
};

function exportCsv(receipts: Receipt[], destination: string) {
  const header = "Date,Description,Category,Amount\n";
  const rows = receipts
    .map((r) => `${r.date},"${r.description}",${r.category},${r.amount}`)
    .join("\n");
  const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `receipts-${destination.replace(/[^a-zA-Z0-9]/g, "_")}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function ReceiptsContent() {
  const [allReceipts, setAllReceipts] = useState<Receipt[]>([]);
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [exportFeedback, setExportFeedback] = useState<string | null>(null);

  useEffect(() => {
    const r = getReceipts();
    const it = getItineraries();
    setAllReceipts(r);
    setItineraries(it);
    if (it.length > 0) setSelectedTripId(it[0].tripId);
  }, []);

  const receipts = useMemo(() => {
    if (!selectedTripId) return allReceipts;
    return allReceipts.filter((r) => r.tripId === selectedTripId);
  }, [allReceipts, selectedTripId]);

  const total = useMemo(() => receipts.reduce((sum, r) => sum + r.amount, 0), [receipts]);

  const selectedItinerary = itineraries.find((i) => i.tripId === selectedTripId);

  const showFeedback = (msg: string) => {
    setExportFeedback(msg);
    setTimeout(() => setExportFeedback(null), 2000);
  };

  return (
    <PageShell title="Receipts">
      {itineraries.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <select
            value={selectedTripId ?? ""}
            onChange={(e) => setSelectedTripId(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm font-departure-mono focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {itineraries.map((it) => (
              <option key={it.id} value={it.tripId}>
                {it.destination}
              </option>
            ))}
          </select>
          <div className="flex gap-2 ml-auto">
            <SecondaryGrowButton
              size="sm"
              className="font-departure-mono"
              onClick={() => exportCsv(receipts, selectedItinerary?.destination ?? "trip")}
            >
              <Download className="h-3.5 w-3.5" />
              Export CSV
            </SecondaryGrowButton>
            <SecondaryGrowButton
              size="sm"
              className="font-departure-mono"
              onClick={() => showFeedback("XLSX export coming soon")}
            >
              <Download className="h-3.5 w-3.5" />
              Export XLSX
            </SecondaryGrowButton>
            <SecondaryGrowButton
              size="sm"
              className="font-departure-mono"
              onClick={() => showFeedback("PDF export coming soon")}
            >
              <Download className="h-3.5 w-3.5" />
              Export PDF
            </SecondaryGrowButton>
          </div>
        </div>
      )}

      {exportFeedback && (
        <div className="mb-4 rounded-md bg-muted px-4 py-2 text-sm font-departure-mono text-muted-foreground animate-in fade-in-0">
          {exportFeedback}
        </div>
      )}

      {receipts.length === 0 ? (
        <EmptyState message="No receipts yet." />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-departure-mono">Date</TableHead>
                <TableHead className="font-departure-mono">Description</TableHead>
                <TableHead className="font-departure-mono">Category</TableHead>
                <TableHead className="font-departure-mono text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {receipts.map((receipt) => (
                <TableRow key={receipt.id}>
                  <TableCell className="font-departure-mono text-sm text-muted-foreground whitespace-nowrap">
                    {new Date(receipt.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </TableCell>
                  <TableCell className="font-wenkai-mono-bold">{receipt.description}</TableCell>
                  <TableCell>
                    <Badge
                      className={`font-departure-mono text-xs capitalize border-0 ${CATEGORY_COLORS[receipt.category] ?? ""}`}
                    >
                      {receipt.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-departure-mono">
                    ${receipt.amount.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3} className="font-departure-mono font-semibold">
                  Total
                </TableCell>
                <TableCell className="text-right font-departure-mono font-semibold">
                  ${total.toLocaleString()}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      )}
    </PageShell>
  );
}
