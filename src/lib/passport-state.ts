import { SEED_PASSPORT_DATA } from "@/data/passport";

const PASSPORT_KEY = "uncharted_passport_history";

export interface PassportTrip {
  id: string;
  destination: string;
  country: string;
  startDate: string;
  endDate: string;
  hotel: string;
  activities: string[];
  notes: string;
  status: "upcoming" | "past";
}

export interface PassportStats {
  countriesVisited: number;
  tripsTaken: number;
  hotelsStayed: number;
  restaurantsTried: number;
}

export interface PassportData {
  trips: PassportTrip[];
  stats: PassportStats;
}

function readData(): PassportData {
  if (typeof window === "undefined") return SEED_PASSPORT_DATA;
  try {
    const raw = localStorage.getItem(PASSPORT_KEY);
    if (!raw) {
      localStorage.setItem(PASSPORT_KEY, JSON.stringify(SEED_PASSPORT_DATA));
      return SEED_PASSPORT_DATA;
    }
    return JSON.parse(raw) as PassportData;
  } catch {
    return SEED_PASSPORT_DATA;
  }
}

function writeData(data: PassportData): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PASSPORT_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export function getPassportData(): PassportData {
  return readData();
}

export function getUpcomingTrips(): PassportTrip[] {
  return readData().trips.filter((t) => t.status === "upcoming");
}

export function getPastTrips(): PassportTrip[] {
  return readData().trips.filter((t) => t.status === "past");
}

export function getPassportStats(): PassportStats {
  return readData().stats;
}

export function addPassportTrip(
  data: Omit<PassportTrip, "id">
): PassportTrip {
  const trip: PassportTrip = {
    id: `pt_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    ...data,
  };
  const current = readData();
  current.trips = [trip, ...current.trips];
  writeData(current);
  return trip;
}

export function removePassportTrip(id: string): boolean {
  const current = readData();
  const filtered = current.trips.filter((t) => t.id !== id);
  if (filtered.length === current.trips.length) return false;
  current.trips = filtered;
  writeData(current);
  return true;
}
