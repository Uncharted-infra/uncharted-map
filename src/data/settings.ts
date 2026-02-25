export const TRAVEL_FIELDS = [
  { label: "Preferred airports", placeholder: "e.g. JFK, LGA, EWR" },
  { label: "Seat class", placeholder: "Economy / Business / First" },
  { label: "Hotel level", placeholder: "Budget / Standard / Luxury" },
  { label: "Dietary restrictions", placeholder: "e.g. Vegetarian, Gluten-free" },
  { label: "Accessibility needs", placeholder: "Any accessibility requirements" },
  { label: "Favorite airlines", placeholder: "e.g. Delta, United" },
  { label: "Favorite hotel chains", placeholder: "e.g. Marriott, Hilton" },
];

export const INTEGRATIONS = [
  { name: "Gmail / Outlook", desc: "Import reservations from email", disabled: false },
  { name: "Calendar sync", desc: "Sync trips to your calendar", disabled: false },
  { name: "WhatsApp", desc: "Future agent messaging", disabled: true },
  { name: "iMessage", desc: "Future agent messaging", disabled: true },
];

export const NOTIFICATION_ITEMS = [
  { id: "booking", label: "Booking confirmations" },
  { id: "price", label: "Price drops" },
  { id: "itinerary", label: "Itinerary changes" },
  { id: "reminders", label: "Travel reminders" },
];
