export interface CompassPlan {
  id: string;
  travelerName: string;
  travelerInitials: string;
  destination: string;
  country: string;
  dateRange: string;
  hotel: string;
  flight: string;
  activities: string[];
  itinerary: { day: number; description: string }[];
}

export const COMPASS_PLANS: CompassPlan[] = [
  {
    id: "cp_1",
    travelerName: "Mia Chen",
    travelerInitials: "MC",
    destination: "Tokyo",
    country: "Japan",
    dateRange: "Apr 10 – Apr 18, 2026",
    hotel: "Park Hyatt Tokyo",
    flight: "Delta DL 275 — JFK → NRT",
    activities: ["Tsukiji Outer Market", "Meiji Shrine", "Shibuya Crossing", "Akihabara"],
    itinerary: [
      { day: 1, description: "Arrive at Narita, check in Park Hyatt, evening walk through Shinjuku." },
      { day: 2, description: "Tsukiji Outer Market in the morning, TeamLab Borderless afternoon." },
      { day: 3, description: "Day trip to Hakone, hot springs and views of Mt. Fuji." },
      { day: 4, description: "Meiji Shrine, Harajuku, Omotesando shopping." },
      { day: 5, description: "Akihabara and Ueno Park, dinner in Roppongi." },
    ],
  },
  {
    id: "cp_2",
    travelerName: "Luca Moretti",
    travelerInitials: "LM",
    destination: "Amalfi Coast",
    country: "Italy",
    dateRange: "Jun 5 – Jun 12, 2026",
    hotel: "Hotel Santa Caterina",
    flight: "Alitalia AZ 610 — LAX → FCO",
    activities: ["Positano", "Path of the Gods hike", "Ravello gardens", "Capri day trip"],
    itinerary: [
      { day: 1, description: "Land in Rome, private transfer to Amalfi, settle in." },
      { day: 2, description: "Explore Positano, beach day, cliffside dinner." },
      { day: 3, description: "Path of the Gods hike, Nocelle to Positano." },
      { day: 4, description: "Ferry to Capri, Blue Grotto, lunch at Da Paolino." },
      { day: 5, description: "Ravello — Villa Rufolo gardens, concert at sunset." },
    ],
  },
  {
    id: "cp_3",
    travelerName: "Priya Nair",
    travelerInitials: "PN",
    destination: "Marrakech",
    country: "Morocco",
    dateRange: "Mar 20 – Mar 26, 2026",
    hotel: "La Mamounia",
    flight: "Royal Air Maroc AT 201 — JFK → RAK",
    activities: ["Jemaa el-Fnaa", "Majorelle Garden", "Sahara day trip", "Souk shopping"],
    itinerary: [
      { day: 1, description: "Arrive, check in La Mamounia, explore Medina." },
      { day: 2, description: "Majorelle Garden morning, cooking class afternoon." },
      { day: 3, description: "Day trip to Atlas Mountains, Berber village lunch." },
      { day: 4, description: "Souk shopping, traditional hammam experience." },
      { day: 5, description: "Jemaa el-Fnaa at sunset, farewell dinner on rooftop." },
    ],
  },
  {
    id: "cp_4",
    travelerName: "James Wright",
    travelerInitials: "JW",
    destination: "Reykjavik",
    country: "Iceland",
    dateRange: "Sep 1 – Sep 8, 2026",
    hotel: "The Retreat at Blue Lagoon",
    flight: "Icelandair FI 614 — BOS → KEF",
    activities: ["Golden Circle", "Blue Lagoon", "Northern Lights", "Glacier hike"],
    itinerary: [
      { day: 1, description: "Arrive Keflavik, Blue Lagoon evening soak." },
      { day: 2, description: "Golden Circle — Thingvellir, Geysir, Gullfoss." },
      { day: 3, description: "South Coast — Seljalandsfoss, Skogafoss, black sand beach." },
      { day: 4, description: "Glacier hike at Solheimajokull." },
      { day: 5, description: "Whale watching from Reykjavik, Hallgrimskirkja." },
    ],
  },
  {
    id: "cp_5",
    travelerName: "Sofia Alvarez",
    travelerInitials: "SA",
    destination: "Buenos Aires",
    country: "Argentina",
    dateRange: "Nov 15 – Nov 22, 2026",
    hotel: "Alvear Palace Hotel",
    flight: "Aerolíneas AR 1301 — MIA → EZE",
    activities: ["La Boca", "San Telmo market", "Tango show", "Estancia day trip"],
    itinerary: [
      { day: 1, description: "Arrive Ezeiza, check in Alvear Palace, Recoleta walk." },
      { day: 2, description: "San Telmo Sunday market, street tango, antique browsing." },
      { day: 3, description: "La Boca and Caminito, Boca Juniors stadium." },
      { day: 4, description: "Estancia day trip — horseback riding and asado lunch." },
      { day: 5, description: "Palermo Soho, dinner, evening tango show at Rojo Tango." },
    ],
  },
];
