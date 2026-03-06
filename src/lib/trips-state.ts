const TRIPS_STATE_KEY = "uncharted_map_trips";

export type ChatMode = "explore" | "plan" | "book";

export interface Trip {
  id: string;
  name: string;
  mode: ChatMode;
  date: string;
  pinned?: boolean;
  archived?: boolean;
}

function generateId(): string {
  return `trip_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getTrips(): Trip[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = localStorage.getItem(TRIPS_STATE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (t): t is Trip =>
        t &&
        typeof t === "object" &&
        typeof (t as Trip).id === "string" &&
        typeof (t as Trip).name === "string" &&
        ((t as Trip).mode === "explore" ||
          (t as Trip).mode === "plan" ||
          (t as Trip).mode === "book") &&
        typeof (t as Trip).date === "string"
    ).map((t) => ({
      ...t,
      pinned: t.pinned ?? false,
      archived: t.archived ?? false,
    }));
  } catch {
    return [];
  }
}

export function addTrip(name: string, mode: ChatMode): Trip {
  const trip: Trip = {
    id: generateId(),
    name,
    mode,
    date: formatDate(new Date()),
    pinned: false,
    archived: false,
  };
  if (typeof window === "undefined") {
    return trip;
  }
  try {
    const trips = getTrips();
    const updated = [trip, ...trips];
    localStorage.setItem(TRIPS_STATE_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage errors
  }
  return trip;
}

export function updateTrip(id: string, updates: Partial<Pick<Trip, "name" | "pinned" | "archived">>): Trip | null {
  const trips = getTrips();
  const idx = trips.findIndex((t) => t.id === id);
  if (idx < 0) return null;
  const updated = { ...trips[idx], ...updates };
  const newTrips = [...trips];
  newTrips[idx] = updated;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(TRIPS_STATE_KEY, JSON.stringify(newTrips));
    } catch {
      return null;
    }
  }
  return updated;
}

export function removeTrip(id: string): boolean {
  const current = getTrips();
  const trips = current.filter((t) => t.id !== id);
  if (trips.length === current.length) return false;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(TRIPS_STATE_KEY, JSON.stringify(trips));
    } catch {
      return false;
    }
  }
  return true;
}
