"use client";

import * as React from "react";

type NewTripContextValue = {
  resetKey: number;
  resetNewTrip: () => void;
};

const NewTripContext = React.createContext<NewTripContextValue | null>(null);

export function NewTripProvider({ children }: { children: React.ReactNode }) {
  const [resetKey, setResetKey] = React.useState(0);

  const resetNewTrip = React.useCallback(() => {
    setResetKey((k) => k + 1);
  }, []);

  const value = React.useMemo(
    () => ({ resetKey, resetNewTrip }),
    [resetKey, resetNewTrip]
  );

  return (
    <NewTripContext.Provider value={value}>{children}</NewTripContext.Provider>
  );
}

export function useNewTrip() {
  const ctx = React.useContext(NewTripContext);
  return ctx;
}
