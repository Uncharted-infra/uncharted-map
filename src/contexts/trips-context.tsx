"use client";

import * as React from "react";
import { getTrips, addTrip as addTripToStorage, updateTrip as updateTripInStorage, removeTrip as removeTripFromStorage, type Trip, type ChatMode } from "@/lib/trips-state";

type TripsContextValue = {
  trips: Trip[];
  addTrip: (name: string, mode: ChatMode) => Trip;
  updateTrip: (id: string, updates: Partial<Pick<Trip, "name" | "pinned" | "archived">>) => Trip | null;
  removeTrip: (id: string) => boolean;
  refreshTrips: () => void;
};

const TripsContext = React.createContext<TripsContextValue | null>(null);

export function TripsProvider({ children }: { children: React.ReactNode }) {
  const [trips, setTrips] = React.useState<Trip[]>([]);

  const refreshTrips = React.useCallback(() => {
    setTrips(getTrips());
  }, []);

  React.useEffect(() => {
    refreshTrips();
  }, [refreshTrips]);

  const addTrip = React.useCallback((name: string, mode: ChatMode) => {
    const trip = addTripToStorage(name, mode);
    setTrips((prev) => [trip, ...prev]);
    return trip;
  }, []);

  const updateTrip = React.useCallback((id: string, updates: Partial<Pick<Trip, "name" | "pinned" | "archived">>) => {
    const updated = updateTripInStorage(id, updates);
    if (updated) {
      setTrips((prev) => prev.map((t) => (t.id === id ? updated : t)));
    }
    return updated;
  }, []);

  const removeTrip = React.useCallback((id: string) => {
    const ok = removeTripFromStorage(id);
    if (ok) {
      setTrips((prev) => prev.filter((t) => t.id !== id));
    }
    return ok;
  }, []);

  const value = React.useMemo(
    () => ({ trips, addTrip, updateTrip, removeTrip, refreshTrips }),
    [trips, addTrip, updateTrip, removeTrip, refreshTrips]
  );

  return <TripsContext.Provider value={value}>{children}</TripsContext.Provider>;
}

export function useTrips() {
  const ctx = React.useContext(TripsContext);
  if (!ctx) {
    throw new Error("useTrips must be used within TripsProvider");
  }
  return ctx;
}

export function useTripsOptional(): TripsContextValue | null {
  return React.useContext(TripsContext);
}
