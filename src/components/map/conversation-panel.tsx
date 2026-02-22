"use client";

import { useState } from "react";
import { Share2, Map, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatInput } from "./chat-input";
import {
  DestinationCard,
  FlightOptionCard,
  HotelCard,
  ItineraryDayCard,
} from "./action-cards";
import { cn } from "@/lib/utils";

const SAMPLE_MESSAGES = [
  {
    role: "user" as const,
    content: "I want to go somewhere warm in March.",
  },
  {
    role: "map" as const,
    content: "Here are three destinations that are ideal in March:",
    cards: "destination",
  },
  {
    role: "user" as const,
    content: "Let's do Lisbon. Plan a 5-day trip.",
  },
  {
    role: "map" as const,
    content: "Here's a draft itinerary for Lisbon. I've included flights and a hotel option.",
    cards: "itinerary",
  },
];

export function ConversationPanel({ className }: { className?: string }) {
  const [tripName, setTripName] = useState("Italy in September");
  const [messages, setMessages] = useState(SAMPLE_MESSAGES);

  const handleSend = (message: string) => {
    setMessages((prev) => [...prev, { role: "user", content: message }]);
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <header className="flex items-center justify-between gap-4 border-b px-4 py-3 shrink-0">
        <input
          value={tripName}
          onChange={(e) => setTripName(e.target.value)}
          className="font-fenix text-lg font-semibold bg-transparent border-none focus:outline-none focus:ring-0 min-w-0 flex-1"
        />
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
          <div className="font-departure-mono text-xs text-muted-foreground flex items-center gap-1">
            <Map className="h-3 w-3" />
            <span>12 maps left</span>
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            New Trip
          </Button>
        </div>
      </header>

      <ScrollArea className="flex-1">
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={cn(
                "animate-in fade-slide-up",
                msg.role === "user" ? "flex justify-end" : "flex justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[85%]",
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-2"
                    : "space-y-3"
                )}
              >
                <p className="font-fenix text-sm">{msg.content}</p>
                {msg.role === "map" && msg.cards === "destination" && (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mt-3">
                    <DestinationCard
                      name="Lisbon"
                      overview="Coastal capital with historic trams and pastel buildings."
                      bestTime="March–May, September–October"
                    />
                    <DestinationCard
                      name="Barcelona"
                      overview="Art, architecture, and Mediterranean beaches."
                      bestTime="April–June, September–October"
                    />
                    <DestinationCard
                      name="Sicily"
                      overview="Italian island with ancient ruins and warm weather."
                      bestTime="March–May, September–November"
                    />
                  </div>
                )}
                {msg.role === "map" && msg.cards === "itinerary" && (
                  <div className="space-y-3 mt-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <FlightOptionCard
                        airline="TAP Air Portugal"
                        departure="JFK 8:00"
                        arrival="LIS 19:30"
                        price="$420"
                      />
                      <HotelCard
                        name="Hotel Avenida Palace"
                        rating={4.8}
                        location="Lisbon City Center"
                        amenities={["WiFi", "Breakfast", "Bar"]}
                      />
                    </div>
                    <ItineraryDayCard
                      dayTitle="Day 1 — Arrival"
                      activities={[
                        { time: "19:30", title: "Land at Lisbon Airport" },
                        { time: "21:00", title: "Check in, dinner in Baixa" },
                      ]}
                    />
                    <ItineraryDayCard
                      dayTitle="Day 2 — Alfama & Belém"
                      activities={[
                        { time: "09:00", title: "Tram 28 through Alfama" },
                        { time: "14:00", title: "Belém Tower & Pastéis" },
                      ]}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <ChatInput onSend={handleSend} />
    </div>
  );
}
