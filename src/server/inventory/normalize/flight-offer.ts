import { createHash } from "crypto";

import type {
  CabinClass,
  FlightOffer,
  InventorySearchInput,
  ProviderRef,
} from "../types";

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord | null {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as UnknownRecord;
  }
  return null;
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value.replace(/[^0-9.-]/g, ""));
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function mapCabin(seat: string | null | undefined): CabinClass {
  const normalized = (seat ?? "economy").toLowerCase();
  if (normalized.includes("first")) return "FIRST";
  if (normalized.includes("business")) return "BUSINESS";
  if (normalized.includes("premium")) return "PREMIUM_ECONOMY";
  return "ECONOMY";
}

function stableOfferId(parts: string[]): string {
  return createHash("sha256").update(parts.join("|")).digest("hex").slice(0, 16);
}

function extractPrice(raw: UnknownRecord): { amount: number; currency: string } {
  const price = asRecord(raw.price) ?? raw;
  const amount =
    asNumber(price.amount) ??
    asNumber(price.value) ??
    asNumber(raw.price) ??
    asNumber(raw.total) ??
    0;
  const currency =
    asString(price.currency) ?? asString(raw.currency) ?? "USD";
  return { amount, currency };
}

function normalizeSingleFlight(
  raw: UnknownRecord,
  input: InventorySearchInput,
  index: number
): FlightOffer | null {
  const origin =
    asString(raw.from) ??
    asString(raw.origin) ??
    asString(raw.from_airport) ??
    input.origin;
  const destination =
    asString(raw.to) ??
    asString(raw.destination) ??
    asString(raw.to_airport) ??
    input.destination;
  const airline =
    asString(raw.airline) ??
    asString(raw.carrier) ??
    asString(raw.name) ??
    "Unknown airline";
  const departAt =
    asString(raw.departAt) ??
    asString(raw.departure) ??
    asString(raw.departure_time) ??
    null;
  const arriveAt =
    asString(raw.arriveAt) ??
    asString(raw.arrival) ??
    asString(raw.arrival_time) ??
    null;
  const durationMinutes =
    asNumber(raw.durationMinutes) ?? asNumber(raw.duration) ?? null;
  const stops = asNumber(raw.stops) ?? asNumber(raw.stop_count) ?? 0;
  const cabin = mapCabin(asString(raw.cabin) ?? asString(raw.seat) ?? input.cabin ?? undefined);
  const price = extractPrice(raw);
  const deepLink =
    asString(raw.deepLink) ??
    asString(raw.url) ??
    asString(raw.link) ??
    null;
  const providerRef: ProviderRef = {
    name: asString(raw.provider) ?? "fast-flights",
    offerRef: asString(raw.offerRef) ?? asString(raw.id) ?? String(index),
  };
  const id = stableOfferId([
    providerRef.name,
    providerRef.offerRef,
    origin,
    destination,
    departAt ?? "",
    airline,
    String(price.amount),
  ]);

  return {
    id,
    origin: origin.toUpperCase(),
    destination: destination.toUpperCase(),
    departAt,
    arriveAt,
    durationMinutes,
    airline,
    stops,
    cabin,
    price,
    deepLink,
    provider: providerRef,
    expiresAt: asString(raw.expiresAt) ?? null,
  };
}

function collectFlightRecords(payload: unknown): UnknownRecord[] {
  if (Array.isArray(payload)) {
    return payload.map(asRecord).filter((item): item is UnknownRecord => item !== null);
  }

  const root = asRecord(payload);
  if (!root) return [];

  const candidates = [
    root.flights,
    root.results,
    root.offers,
    root.data,
    asRecord(root.data)?.flights,
    asRecord(root.data)?.results,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate.map(asRecord).filter((item): item is UnknownRecord => item !== null);
    }
  }

  return [root];
}

export function normalizeFastFlightsResponse(
  raw: unknown,
  input: InventorySearchInput
): FlightOffer[] {
  const records = collectFlightRecords(raw);
  const offers: FlightOffer[] = [];

  records.forEach((record, index) => {
    const offer = normalizeSingleFlight(record, input, index);
    if (offer) offers.push(offer);
  });

  return offers;
}

export function mockFlightOffers(input: InventorySearchInput): FlightOffer[] {
  const cabin = mapCabin(input.cabin ?? undefined);
  const basePrice = cabin === "FIRST" ? 4200 : cabin === "BUSINESS" ? 2800 : 650;
  const id = stableOfferId([
    "mock",
    input.origin,
    input.destination,
    input.departDate,
    cabin,
  ]);

  return [
    {
      id,
      origin: input.origin.toUpperCase(),
      destination: input.destination.toUpperCase(),
      departAt: `${input.departDate}T08:30:00Z`,
      arriveAt: `${input.departDate}T20:45:00Z`,
      durationMinutes: 495,
      airline: "Mock Airways",
      stops: 0,
      cabin,
      price: { amount: basePrice, currency: "USD" },
      deepLink: `https://www.google.com/travel/flights?q=Flights%20${input.origin}%20to%20${input.destination}%20on%20${input.departDate}`,
      provider: { name: "mock", offerRef: id },
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    },
  ];
}
