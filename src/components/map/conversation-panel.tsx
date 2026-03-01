"use client";

import { useState, useMemo } from "react";
import { ChatInput, type ChatMode } from "./chat-input";
import { ExploreGlobe } from "./explore-globe";
import { findMatchingCountry } from "@/data/globe-countries";
import { cn } from "@/lib/utils";

export function ConversationPanel({ className }: { className?: string }) {
  const [hasMessages, setHasMessages] = useState(false);
  const [mode, setMode] = useState<ChatMode>("explore");
  const [exploreInput, setExploreInput] = useState("");

  const handleSend = (message: string) => {
    setHasMessages(true);
    void message;
  };

  const handleModeChange = (newMode: ChatMode) => {
    setMode(newMode);
    if (newMode !== "explore") setExploreInput("");
  };

  const showGlobe = !hasMessages && mode === "explore";
  const highlightedCountry = useMemo(
    () => (showGlobe ? findMatchingCountry(exploreInput) : null),
    [showGlobe, exploreInput]
  );
  // Only rotate globe when user has selected a country (exact match - from dropdown click or full name typed)
  const centerOnCountry = useMemo(() => {
    if (!showGlobe || !highlightedCountry) return null;
    const trimmed = exploreInput.trim();
    if (!trimmed) return null;
    return trimmed.toLowerCase() === highlightedCountry.toLowerCase() ? highlightedCountry : null;
  }, [showGlobe, highlightedCountry, exploreInput]);

  // With messages: chat at bottom
  if (hasMessages) {
    return (
      <div className={cn("flex flex-col h-full bg-background p-4", className)}>
        <div className="flex-1 min-h-0" />
        <ChatInput
          onSend={handleSend}
          mode={mode}
          onModeChange={handleModeChange}
          onInputChange={setExploreInput}
        />
      </div>
    );
  }

  // No messages: unified layout with globe + chat
  // Plan/Book: globe fades out, chat slides down to center
  // Explore: globe fades in, chat slides up to top
  return (
    <div
      className={cn(
        "grid h-full bg-background p-4 transition-[grid-template-rows] duration-500 ease-smooth",
        showGlobe ? "grid-rows-[auto_1fr]" : "grid-rows-[1fr_0fr]",
        className
      )}
    >
      {/* Chat wrapper: at top when globe shown, expands to center when Plan/Book */}
      <div
        className={cn(
        "flex min-h-0 transition-all duration-500 ease-smooth",
        showGlobe ? "flex-col justify-start" : "flex-col justify-center items-center"
        )}
      >
        {!showGlobe && (
          <p className="font-fenix text-xl text-foreground mb-6 animate-fade-slide-up">
            Explore, plan, or book trips - anytime & anywhere
          </p>
        )}
        <div
          className={cn(
            "w-full max-w-2xl mx-auto transition-all duration-500 ease-smooth",
            showGlobe ? "mb-4 shrink-0" : ""
          )}
        >
          <ChatInput
            onSend={handleSend}
            mode={mode}
            onModeChange={handleModeChange}
            onInputChange={setExploreInput}
            value={exploreInput}
          />
        </div>
      </div>

      {/* Globe: fades out on Plan/Book, fades in on Explore */}
      <div
        className={cn(
          "min-h-0 flex items-center justify-center overflow-hidden transition-opacity duration-400 ease-out",
          showGlobe
            ? "opacity-100"
            : "opacity-0 pointer-events-none"
        )}
      >
        <div
          className={cn(
            "w-full max-w-2xl h-full transition-transform duration-400 ease-out",
            showGlobe ? "scale-100" : "scale-95"
          )}
        >
          <ExploreGlobe
            className="w-full h-full"
            highlightedCountry={highlightedCountry}
            centerOnCountry={centerOnCountry}
            onCountrySelect={setExploreInput}
          />
        </div>
      </div>
    </div>
  );
}
