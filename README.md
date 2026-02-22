# Map — Uncharted AI Travel Agent

Map is the conversational AI travel agent inside Uncharted. It can explore destinations, plan itineraries, and book hotels, reservations, activities, and transport.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Components:** shadcn/ui
- **Icons:** lucide-react
- **Fonts:** Cormorant Garamond (Fenix), JetBrains Mono (departure-mono)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Structure

- **Sidebar** (left): Search, Trips, Friends, Luggage, Passport, Profile, Settings
- **Conversation Panel** (center): Chat with Map, action cards, itinerary
- **Context Panel** (right): Trip snapshot, itinerary, bookings, budget, quick actions

On mobile, the Context Panel becomes a slide-over sheet (tap the panel button).

## Settings

Visit `/settings` for Account, Travel Preferences, Maps (token usage), Notifications, and Integrations.

## Fonts

The spec calls for Fenix and departure-mono. This build uses Cormorant Garamond and JetBrains Mono as fallbacks. To use the actual Fenix font, add the font files to `fonts/Fenix/` and update `src/app/layout.tsx` with `@font-face` or `next/font/local`.
