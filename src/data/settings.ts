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

export const PERSONALITY_OPTIONS = [
  { group: "🧠 Analysts", items: [
    { id: "INTJ", title: "Architect", desc: "Plans a hyper-efficient, optimized itinerary months in advance and quietly experiences each destination with strategic precision." },
    { id: "INTP", title: "Logician", desc: "Spends half the trip researching the history, culture, and philosophy of the place and the other half wandering thoughtfully off-schedule." },
    { id: "ENTJ", title: "Commander", desc: "Turns the group trip into a flawlessly executed global operation with bookings, backup plans, and ambitious goals." },
    { id: "ENTP", title: "Debater", desc: "Books the trip last minute, befriends strangers immediately, and somehow ends up at the most unexpected underground event." },
  ]},
  { group: "💛 Diplomats", items: [
    { id: "INFJ", title: "Advocate", desc: "Seeks deeply meaningful cultural experiences and hidden spots that feel authentic and transformative." },
    { id: "INFP", title: "Mediator", desc: "Wanders poetic streets, journals in cafés, and chases emotional, soul-stirring moments over tourist checklists." },
    { id: "ENFJ", title: "Protagonist", desc: "Curates experiences everyone will love and connects deeply with locals wherever they go." },
    { id: "ENFP", title: "Campaigner", desc: "Travels with boundless excitement, says yes to everything, and collects spontaneous stories in every city." },
  ]},
  { group: "🛡 Sentinels", items: [
    { id: "ISTJ", title: "Logistician", desc: "Researches thoroughly, follows a structured plan, and ensures nothing important gets missed." },
    { id: "ISFJ", title: "Defender", desc: "Prioritizes comfort, thoughtful planning, and making sure everyone feels safe and happy." },
    { id: "ESTJ", title: "Executive", desc: "Keeps the group organized, on schedule, and maximizing every single day abroad." },
    { id: "ESFJ", title: "Consul", desc: "Builds warm connections everywhere and turns every trip into a shared memory event." },
  ]},
  { group: "🎨 Explorers", items: [
    { id: "ISTP", title: "Virtuoso", desc: "Explores independently, tries adventurous activities, and figures things out on the fly." },
    { id: "ISFP", title: "Adventurer", desc: "Soaks in beautiful scenery, local art, and sensory experiences with quiet appreciation." },
    { id: "ESTP", title: "Entrepreneur", desc: "Seeks thrill, nightlife, action sports, and bold experiences wherever they land." },
    { id: "ESFP", title: "Entertainer", desc: "Finds the party, makes new friends instantly, and lives fully in every moment of the trip." },
  ]},
];
