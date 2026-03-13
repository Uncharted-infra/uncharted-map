import {
  SEED_ITINERARIES,
  SEED_RECEIPTS,
  SEED_VISAS,
} from "@/data/documents";

const ITINERARIES_KEY = "uncharted_docs_itineraries";
const RECEIPTS_KEY = "uncharted_docs_receipts";
const VISAS_KEY = "uncharted_docs_visas";

// --- Itinerary types ---

export interface ItineraryActivity {
  time: string;
  name: string;
  location: string;
  notes: string;
}

export interface ItineraryDay {
  day: number;
  date: string;
  activities: ItineraryActivity[];
}

export interface Itinerary {
  id: string;
  tripId: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelers: { name: string; initials: string }[];
  hotel: string;
  budgetTotal: number;
  budgetSpent: number;
  days: ItineraryDay[];
}

// --- Receipt types ---

export type ReceiptCategory =
  | "flight"
  | "hotel"
  | "food"
  | "activity"
  | "transport"
  | "other";

export interface Receipt {
  id: string;
  tripId: string;
  date: string;
  description: string;
  category: ReceiptCategory;
  amount: number;
}

// --- Visa types ---

export type VisaType = "tourist" | "business" | "transit";
export type VisaStatus = "active" | "expiring" | "expired";

export interface Visa {
  id: string;
  country: string;
  flag: string;
  visaType: VisaType;
  validFrom: string;
  validUntil: string;
}

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function readList<T>(key: string, seed: T[]): T[] {
  if (typeof window === "undefined") return seed;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(seed));
      return seed;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : seed;
  } catch {
    return seed;
  }
}

function writeList<T>(key: string, items: T[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(items));
  } catch {
    // ignore
  }
}

// --- Itineraries ---

export function getItineraries(): Itinerary[] {
  return readList<Itinerary>(ITINERARIES_KEY, SEED_ITINERARIES);
}

export function getItineraryByTrip(tripId: string): Itinerary | null {
  return getItineraries().find((it) => it.tripId === tripId) ?? null;
}

// --- Receipts ---

export function getReceipts(): Receipt[] {
  return readList<Receipt>(RECEIPTS_KEY, SEED_RECEIPTS);
}

export function getReceiptsByTrip(tripId: string): Receipt[] {
  return getReceipts().filter((r) => r.tripId === tripId);
}

export function addReceipt(data: Omit<Receipt, "id">): Receipt {
  const item: Receipt = { id: generateId("rcpt"), ...data };
  const list = getReceipts();
  writeList(RECEIPTS_KEY, [item, ...list]);
  return item;
}

export function removeReceipt(id: string): boolean {
  const list = getReceipts();
  const filtered = list.filter((r) => r.id !== id);
  if (filtered.length === list.length) return false;
  writeList(RECEIPTS_KEY, filtered);
  return true;
}

// --- Visas ---

export function getVisas(): Visa[] {
  return readList<Visa>(VISAS_KEY, SEED_VISAS);
}

export function addVisa(data: Omit<Visa, "id">): Visa {
  const item: Visa = { id: generateId("visa"), ...data };
  const list = getVisas();
  writeList(VISAS_KEY, [item, ...list]);
  return item;
}

export function removeVisa(id: string): boolean {
  const list = getVisas();
  const filtered = list.filter((v) => v.id !== id);
  if (filtered.length === list.length) return false;
  writeList(VISAS_KEY, filtered);
  return true;
}

export function computeVisaStatus(visa: Visa): VisaStatus {
  const now = new Date();
  const until = new Date(visa.validUntil);
  if (until < now) return "expired";
  const thirtyDays = 30 * 24 * 60 * 60 * 1000;
  if (until.getTime() - now.getTime() < thirtyDays) return "expiring";
  return "active";
}
