import { SEED_PLACES, SEED_HOTELS, SEED_FLIGHTS } from "@/data/luggage";

const PLACES_KEY = "uncharted_luggage_places";
const HOTELS_KEY = "uncharted_luggage_hotels";
const FLIGHTS_KEY = "uncharted_luggage_flights";

export type PlaceCategory = "city" | "landmark" | "nature";

export interface SavedPlace {
  id: string;
  name: string;
  country: string;
  category: PlaceCategory;
  notes: string;
}

export type HotelPriceRange = "budget" | "standard" | "luxury";

export interface SavedHotel {
  id: string;
  name: string;
  location: string;
  stars: number;
  priceRange: HotelPriceRange;
  notes: string;
}

export type FlightClass = "economy" | "business" | "first";

export interface SavedFlight {
  id: string;
  airline: string;
  from: string;
  to: string;
  flightClass: FlightClass;
  price: number;
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
    // ignore storage errors
  }
}

// --- Places ---

export function getPlaces(): SavedPlace[] {
  return readList<SavedPlace>(PLACES_KEY, SEED_PLACES);
}

export function addPlace(data: Omit<SavedPlace, "id">): SavedPlace {
  const item: SavedPlace = { id: generateId("place"), ...data };
  const list = getPlaces();
  writeList(PLACES_KEY, [item, ...list]);
  return item;
}

export function removePlace(id: string): boolean {
  const list = getPlaces();
  const filtered = list.filter((p) => p.id !== id);
  if (filtered.length === list.length) return false;
  writeList(PLACES_KEY, filtered);
  return true;
}

// --- Hotels ---

export function getHotels(): SavedHotel[] {
  return readList<SavedHotel>(HOTELS_KEY, SEED_HOTELS);
}

export function addHotel(data: Omit<SavedHotel, "id">): SavedHotel {
  const item: SavedHotel = { id: generateId("hotel"), ...data };
  const list = getHotels();
  writeList(HOTELS_KEY, [item, ...list]);
  return item;
}

export function removeHotel(id: string): boolean {
  const list = getHotels();
  const filtered = list.filter((h) => h.id !== id);
  if (filtered.length === list.length) return false;
  writeList(HOTELS_KEY, filtered);
  return true;
}

// --- Flights ---

export function getFlights(): SavedFlight[] {
  return readList<SavedFlight>(FLIGHTS_KEY, SEED_FLIGHTS);
}

export function addFlight(data: Omit<SavedFlight, "id">): SavedFlight {
  const item: SavedFlight = { id: generateId("flight"), ...data };
  const list = getFlights();
  writeList(FLIGHTS_KEY, [item, ...list]);
  return item;
}

export function removeFlight(id: string): boolean {
  const list = getFlights();
  const filtered = list.filter((f) => f.id !== id);
  if (filtered.length === list.length) return false;
  writeList(FLIGHTS_KEY, filtered);
  return true;
}
