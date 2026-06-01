import { describe, expect, it } from "vitest";

import { canonicalSearchPayload, inputHash } from "./hash";

describe("inputHash", () => {
  it("is stable for equivalent inputs with different casing", () => {
    const a = inputHash("FLIGHTS", {
      origin: "jfk",
      destination: "lis",
      departDate: "2026-06-13",
      adults: 1,
    });
    const b = inputHash("FLIGHTS", {
      origin: "JFK",
      destination: "LIS",
      departDate: "2026-06-13",
      adults: 1,
    });
    expect(a).toBe(b);
  });

  it("changes when search parameters change", () => {
    const base = inputHash("FLIGHTS", {
      origin: "JFK",
      destination: "LIS",
      departDate: "2026-06-13",
      adults: 1,
    });
    const differentDate = inputHash("FLIGHTS", {
      origin: "JFK",
      destination: "LIS",
      departDate: "2026-06-14",
      adults: 1,
    });
    expect(base).not.toBe(differentDate);
  });

  it("canonical payload sorts keys deterministically", () => {
    const payload = canonicalSearchPayload("FLIGHTS", {
      origin: "JFK",
      destination: "LIS",
      departDate: "2026-06-13",
      adults: 2,
      children: 1,
      cabin: "BUSINESS",
    });
    expect(payload.origin).toBe("JFK");
    expect(payload.children).toBe(1);
    expect(payload.cabin).toBe("BUSINESS");
  });
});
