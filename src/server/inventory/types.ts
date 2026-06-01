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

export interface ProviderRef {
  name: string;
  offerRef: string;
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
  provider: ProviderRef;
  expiresAt: string | null;
}

export interface HotelOffer {
  id: string;
  name: string;
  location: string;
  stars: number | null;
  price: Money;
  deepLink: string | null;
  provider: ProviderRef;
  expiresAt: string | null;
}

export interface CarOffer {
  id: string;
  vendor: string;
  vehicleClass: string;
  pickupLocation: string;
  price: Money;
  deepLink: string | null;
  provider: ProviderRef;
  expiresAt: string | null;
}

export type InventoryOffer = FlightOffer | HotelOffer | CarOffer;

export interface SearchError {
  code: string;
  message: string;
}

export interface SearchMeta {
  fetchedAt: string;
  ttlSeconds: number;
  providersAttempted: number;
  providersSucceeded: number;
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
  hotelOffers: HotelOffer[];
  carOffers: CarOffer[];
  error: SearchError | null;
  meta: SearchMeta | null;
}

export interface JobRecord {
  searchId: string;
  kind: InventoryKind;
  inputHash: string;
  status: SearchStatus;
  progress: number;
  error: SearchError | null;
  input: InventorySearchInput;
  createdAt: string;
  updatedAt: string;
}

export interface CachedSearchBlob {
  searchId: string;
  kind: InventoryKind;
  inputHash: string;
  status: SearchStatus;
  flightOffers: FlightOffer[];
  hotelOffers: HotelOffer[];
  carOffers: CarOffer[];
  error: SearchError | null;
  meta: SearchMeta;
}
