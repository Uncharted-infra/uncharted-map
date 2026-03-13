import type { SavedPlace, SavedHotel, SavedFlight } from "@/lib/luggage-state";

export const SEED_PLACES: SavedPlace[] = [
  { id: "place_seed_1", name: "Santorini", country: "Greece", category: "landmark", notes: "Famous sunset views from Oia, blue-domed churches." },
  { id: "place_seed_2", name: "Kyoto", country: "Japan", category: "city", notes: "Bamboo groves, ancient temples, geisha district." },
  { id: "place_seed_3", name: "Banff National Park", country: "Canada", category: "nature", notes: "Lake Louise, turquoise glacial lakes, hiking trails." },
  { id: "place_seed_4", name: "Lisbon", country: "Portugal", category: "city", notes: "Tram 28, pastéis de nata, Alfama district." },
  { id: "place_seed_5", name: "Patagonia", country: "Argentina", category: "nature", notes: "Torres del Paine, glaciers, vast open landscapes." },
];

export const SEED_HOTELS: SavedHotel[] = [
  { id: "hotel_seed_1", name: "Aman Tokyo", location: "Tokyo, Japan", stars: 5, priceRange: "luxury", notes: "Minimalist design, Otemachi tower." },
  { id: "hotel_seed_2", name: "Hotel & Spa & Restaurant", location: "Reykjavik, Iceland", stars: 4, priceRange: "standard", notes: "Central location, geothermal spa." },
  { id: "hotel_seed_3", name: "Riad Yasmine", location: "Marrakech, Morocco", stars: 4, priceRange: "budget", notes: "Beautiful courtyard pool, Instagram-famous." },
  { id: "hotel_seed_4", name: "The Langham", location: "London, UK", stars: 5, priceRange: "luxury", notes: "Historic Victorian property, afternoon tea." },
];

export const SEED_FLIGHTS: SavedFlight[] = [
  { id: "flight_seed_1", airline: "Singapore Airlines", from: "JFK", to: "SIN", flightClass: "business", price: 3200 },
  { id: "flight_seed_2", airline: "Emirates", from: "LAX", to: "DXB", flightClass: "economy", price: 850 },
  { id: "flight_seed_3", airline: "ANA", from: "SFO", to: "NRT", flightClass: "first", price: 5800 },
  { id: "flight_seed_4", airline: "LATAM", from: "MIA", to: "SCL", flightClass: "economy", price: 620 },
];
