import type { HotelOffer } from "../../types";

export const hotelsStubProvider = {
  name: "hotels-stub",
  async search(): Promise<{ stub: true }> {
    return { stub: true };
  },
  normalize(): HotelOffer[] {
    return [
      {
        id: "hotel_stub_lisbon",
        name: "Stub Lisbon Hotel",
        location: "Lisbon, PT",
        stars: 4,
        price: { amount: 189, currency: "EUR" },
        deepLink: "https://example.com/hotels/lisbon-stub",
        provider: { name: "hotels-stub", offerRef: "stub-1" },
        expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      },
    ];
  },
};
