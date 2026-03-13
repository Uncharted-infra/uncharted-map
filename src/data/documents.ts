import type { Itinerary, Receipt, Visa } from "@/lib/documents-state";

export const SEED_ITINERARIES: Itinerary[] = [
  {
    id: "itin_seed_1",
    tripId: "trip_demo_tokyo",
    destination: "Tokyo, Japan",
    startDate: "2026-04-10",
    endDate: "2026-04-15",
    travelers: [
      { name: "Ayush Sharma", initials: "AS" },
      { name: "Mia Chen", initials: "MC" },
    ],
    hotel: "Park Hyatt Tokyo",
    budgetTotal: 5000,
    budgetSpent: 3200,
    days: [
      {
        day: 1,
        date: "2026-04-10",
        activities: [
          { time: "14:00", name: "Check in", location: "Park Hyatt Tokyo", notes: "Request high-floor room" },
          { time: "18:00", name: "Shinjuku evening walk", location: "Shinjuku", notes: "Golden Gai and Omoide Yokocho" },
        ],
      },
      {
        day: 2,
        date: "2026-04-11",
        activities: [
          { time: "07:00", name: "Tsukiji Outer Market", location: "Tsukiji", notes: "Fresh sushi breakfast" },
          { time: "13:00", name: "TeamLab Borderless", location: "Odaiba", notes: "Book tickets in advance" },
          { time: "19:00", name: "Dinner at Narisawa", location: "Minato", notes: "Reservation confirmed" },
        ],
      },
      {
        day: 3,
        date: "2026-04-12",
        activities: [
          { time: "08:00", name: "Day trip to Hakone", location: "Hakone", notes: "Take Romancecar from Shinjuku" },
          { time: "12:00", name: "Hot springs lunch", location: "Hakone", notes: "Tenzan Notenburo onsen" },
          { time: "17:00", name: "Return to Tokyo", location: "Shinjuku", notes: "" },
        ],
      },
      {
        day: 4,
        date: "2026-04-13",
        activities: [
          { time: "09:00", name: "Meiji Shrine", location: "Shibuya", notes: "Morning prayer and forest walk" },
          { time: "12:00", name: "Harajuku & Omotesando", location: "Harajuku", notes: "Shopping and street food" },
          { time: "18:00", name: "Shibuya crossing & dinner", location: "Shibuya", notes: "" },
        ],
      },
      {
        day: 5,
        date: "2026-04-14",
        activities: [
          { time: "10:00", name: "Akihabara exploration", location: "Akihabara", notes: "Electronics and anime" },
          { time: "14:00", name: "Ueno Park", location: "Ueno", notes: "National Museum if time permits" },
          { time: "20:00", name: "Farewell dinner", location: "Roppongi", notes: "" },
        ],
      },
    ],
  },
];

export const SEED_RECEIPTS: Receipt[] = [
  { id: "rcpt_seed_1", tripId: "trip_demo_tokyo", date: "2026-04-10", description: "Delta DL 275 — JFK → NRT", category: "flight", amount: 1200 },
  { id: "rcpt_seed_2", tripId: "trip_demo_tokyo", date: "2026-04-10", description: "Park Hyatt Tokyo (5 nights)", category: "hotel", amount: 2500 },
  { id: "rcpt_seed_3", tripId: "trip_demo_tokyo", date: "2026-04-11", description: "Tsukiji sushi breakfast", category: "food", amount: 45 },
  { id: "rcpt_seed_4", tripId: "trip_demo_tokyo", date: "2026-04-11", description: "TeamLab Borderless tickets x2", category: "activity", amount: 60 },
  { id: "rcpt_seed_5", tripId: "trip_demo_tokyo", date: "2026-04-11", description: "Dinner at Narisawa", category: "food", amount: 320 },
  { id: "rcpt_seed_6", tripId: "trip_demo_tokyo", date: "2026-04-12", description: "Romancecar tickets x2", category: "transport", amount: 50 },
  { id: "rcpt_seed_7", tripId: "trip_demo_tokyo", date: "2026-04-12", description: "Hakone onsen entry", category: "activity", amount: 30 },
  { id: "rcpt_seed_8", tripId: "trip_demo_tokyo", date: "2026-04-13", description: "Harajuku street food", category: "food", amount: 25 },
  { id: "rcpt_seed_9", tripId: "trip_demo_tokyo", date: "2026-04-14", description: "Akihabara souvenirs", category: "other", amount: 80 },
  { id: "rcpt_seed_10", tripId: "trip_demo_tokyo", date: "2026-04-14", description: "Farewell dinner Roppongi", category: "food", amount: 150 },
];

export const SEED_VISAS: Visa[] = [
  { id: "visa_seed_1", country: "Japan", flag: "🇯🇵", visaType: "tourist", validFrom: "2026-01-15", validUntil: "2027-01-15" },
  { id: "visa_seed_2", country: "India", flag: "🇮🇳", visaType: "tourist", validFrom: "2025-06-01", validUntil: "2026-06-01" },
  { id: "visa_seed_3", country: "United Kingdom", flag: "🇬🇧", visaType: "business", validFrom: "2025-03-01", validUntil: "2026-03-01" },
  { id: "visa_seed_4", country: "Brazil", flag: "🇧🇷", visaType: "tourist", validFrom: "2024-11-01", validUntil: "2025-11-01" },
];
