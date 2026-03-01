"use client";

import { useState, useMemo, useEffect } from "react";
import { ChatInput, type ChatMode } from "./chat-input";
import { ExploreGlobe } from "./explore-globe";
import { Button } from "@/components/ui/button";
import { findMatchingCountry, COUNTRY_NAMES } from "@/data/globe-countries";
import { getChatState, setChatState } from "@/lib/chat-state";
import { cn } from "@/lib/utils";

export function ConversationPanel({ className }: { className?: string }) {
  const [hasMessages, setHasMessages] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [mode, setMode] = useState<ChatMode>("explore");
  const [exploreInput, setExploreInput] = useState("");

  useEffect(() => {
    const stored = getChatState();
    if (stored.country && COUNTRY_NAMES.includes(stored.country)) {
      setSelectedCountry(stored.country);
      setMode(stored.mode);
    }
  }, []);

  const handleSend = (message: string) => {
    setHasMessages(true);
    void message;
  };

  const handleModeChange = (newMode: ChatMode) => {
    setMode(newMode);
    if (selectedCountry) {
      setChatState(selectedCountry, newMode);
    }
    if (newMode !== "explore") setExploreInput("");
  };

  const handleCountrySelect = (country: string) => {
    const value = country.trim() || null;
    setSelectedCountry(value);
    setChatState(value, mode);
    setExploreInput("");
  };

  const handleChangeDestination = () => {
    setSelectedCountry(null);
    setChatState(null, mode);
    setExploreInput("");
  };

  const showGlobe = !hasMessages;
  const highlightedCountry = useMemo(
    () =>
      selectedCountry
        ? selectedCountry
        : showGlobe
          ? findMatchingCountry(exploreInput)
          : null,
    [showGlobe, exploreInput, selectedCountry]
  );
  const centerOnCountry = useMemo(() => {
    if (!showGlobe || !highlightedCountry) return null;
    if (selectedCountry) return selectedCountry;
    const trimmed = exploreInput.trim();
    if (!trimmed) return null;
    return trimmed.toLowerCase() === highlightedCountry.toLowerCase()
      ? highlightedCountry
      : null;
  }, [showGlobe, highlightedCountry, exploreInput, selectedCountry]);

  if (hasMessages) {
    return (
      <div className={cn("flex flex-col h-full bg-background p-4", className)}>
        <div className="flex-1 min-h-0" />
        <div className="flex items-center gap-2 w-full max-w-[calc(42rem+8rem)] mx-auto">
          <div className="flex-1 min-w-0 max-w-2xl">
            <ChatInput
              onSend={handleSend}
              mode={mode}
              onModeChange={handleModeChange}
              onInputChange={setExploreInput}
              showModeSelector={!!selectedCountry}
              selectedCountry={selectedCountry}
            />
          </div>
          {selectedCountry && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleChangeDestination}
              className="shrink-0 cursor-pointer"
            >
              Change destination
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid h-full bg-background p-4 transition-[grid-template-rows] duration-500 ease-smooth grid-rows-[auto_1fr]",
        className
      )}
    >
      <div className="flex min-h-0 flex-col justify-start">
        <div className="w-full max-w-[calc(42rem+8rem)] mx-auto mb-4 shrink-0 flex items-center gap-2">
          <div className="flex-1 min-w-0 max-w-2xl">
            <ChatInput
              onSend={handleSend}
              mode={mode}
              onModeChange={handleModeChange}
              onInputChange={setExploreInput}
              value={exploreInput}
              showModeSelector={true}
              selectedCountry={selectedCountry}
            />
          </div>
          {selectedCountry && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleChangeDestination}
              className="shrink-0 cursor-pointer"
            >
              Change destination
            </Button>
          )}
        </div>
      </div>
      <div className="min-h-0 flex flex-col items-center justify-center overflow-hidden">
        <div className="flex items-center justify-center mb-2 mt-[60px] font-departure-mono text-foreground text-[0.875rem]">
          <span>Drag to rotate · Click to select</span>
        </div>
        <div className="w-full max-w-2xl h-full flex-1 min-h-0">
          <ExploreGlobe
            className="w-full h-full"
            highlightedCountry={highlightedCountry}
            centerOnCountry={centerOnCountry}
            onCountrySelect={handleCountrySelect}
          />
        </div>
      </div>
    </div>
  );
}
