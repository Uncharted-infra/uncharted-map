import type { InventorySearchInput } from "../../types";
import { mockFlightOffers, normalizeFastFlightsResponse } from "../../normalize/flight-offer";

export interface FlightsSidecarRequest {
  flights: Array<{
    date: string;
    from_airport: string;
    to_airport: string;
  }>;
  seat: string;
  trip: "one-way" | "round-trip";
  passengers: { adults: number; children?: number };
  language: string;
}

export interface InventoryProvider<TInput, TRaw> {
  name: string;
  search(input: TInput): Promise<TRaw>;
  normalize(raw: TRaw, input: TInput): import("../../types").FlightOffer[];
}

function sidecarUrl(): string | undefined {
  return process.env.FLIGHTS_SIDECAR_URL?.trim() || undefined;
}

function mapSeat(cabin: InventorySearchInput["cabin"]): string {
  switch (cabin) {
    case "FIRST":
      return "first";
    case "BUSINESS":
      return "business";
    case "PREMIUM_ECONOMY":
      return "premium-economy";
    default:
      return "economy";
  }
}

export function toSidecarRequest(input: InventorySearchInput): FlightsSidecarRequest {
  const legs = [
    {
      date: input.departDate,
      from_airport: input.origin.toUpperCase(),
      to_airport: input.destination.toUpperCase(),
    },
  ];

  if (input.returnDate) {
    legs.push({
      date: input.returnDate,
      from_airport: input.destination.toUpperCase(),
      to_airport: input.origin.toUpperCase(),
    });
  }

  return {
    flights: legs,
    seat: mapSeat(input.cabin),
    trip: input.returnDate ? "round-trip" : "one-way",
    passengers: {
      adults: input.adults,
      ...(input.children ? { children: input.children } : {}),
    },
    language: "en",
  };
}

export async function searchFlightsSidecar(
  input: InventorySearchInput,
  timeoutMs = 60_000
): Promise<unknown> {
  const baseUrl = sidecarUrl();
  if (!baseUrl) {
    throw new Error("FLIGHTS_SIDECAR_URL is not configured");
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${baseUrl.replace(/\/$/, "")}/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toSidecarRequest(input)),
      signal: controller.signal,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Flights sidecar error (${response.status}): ${text}`);
    }

    const json = (await response.json()) as { data?: unknown; ok?: boolean; error?: string };
    if (json.ok === false) {
      throw new Error(json.error ?? "Flights sidecar returned ok=false");
    }
    return json.data ?? json;
  } finally {
    clearTimeout(timer);
  }
}

export const mockFlightsProvider: InventoryProvider<
  InventorySearchInput,
  InventorySearchInput
> = {
  name: "mock",
  async search(input) {
    return input;
  },
  normalize(_raw, input) {
    return mockFlightOffers(input);
  },
};

export const fastFlightsSidecarProvider: InventoryProvider<
  InventorySearchInput,
  unknown
> = {
  name: "fast-flights",
  async search(input) {
    return searchFlightsSidecar(input);
  },
  normalize(raw, input) {
    return normalizeFastFlightsResponse(raw, input);
  },
};

export function getFlightsProvider(): InventoryProvider<
  InventorySearchInput,
  unknown
> {
  if (sidecarUrl()) {
    return fastFlightsSidecarProvider;
  }
  return mockFlightsProvider;
}
