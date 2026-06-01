export type InventoryKind = "FLIGHTS" | "HOTELS" | "CARS";

export type SearchStatus =
  | "READY"
  | "STARTED"
  | "PARTIAL"
  | "COMPLETE"
  | "FAILED"
  | "EXPIRED";

export type CabinClass =
  | "ECONOMY"
  | "PREMIUM_ECONOMY"
  | "BUSINESS"
  | "FIRST";

export interface Money {
  amount: number;
  currency: string;
}

export interface FlightOffer {
  id: string;
  origin: string;
  destination: string;
  departAt: string | null;
  arriveAt: string | null;
  durationMinutes: number | null;
  airline: string;
  stops: number;
  cabin: CabinClass;
  price: Money;
  deepLink: string | null;
  provider: { name: string; offerRef: string };
  expiresAt: string | null;
}

export interface InventorySearchInput {
  origin: string;
  destination: string;
  departDate: string;
  returnDate?: string | null;
  adults: number;
  children?: number | null;
  cabin?: CabinClass | null;
}

export interface InventorySearchResponse {
  searchId: string;
  kind: InventoryKind;
  status: SearchStatus;
  cacheHit: boolean;
  stale: boolean;
  flightOffers: FlightOffer[];
  hotelOffers: unknown[];
  carOffers: unknown[];
  error: { code: string; message: string } | null;
  meta: {
    fetchedAt: string;
    ttlSeconds: number;
    providersAttempted: number;
    providersSucceeded: number;
  } | null;
}
