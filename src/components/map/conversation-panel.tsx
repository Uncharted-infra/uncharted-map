"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { GripVertical, Earth } from "lucide-react";
import { ChatInput, type ChatMode } from "./chat-input";
import { ExploreGlobe } from "./explore-globe";
import { findMatchingCountry, COUNTRY_NAMES } from "@/data/globe-countries";
import { getChatState, setChatState } from "@/lib/chat-state";
import { cn } from "@/lib/utils";

export function ConversationPanel({ className }: { className?: string }) {
  const [hasMessages, setHasMessages] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
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
    setIsConfirmed(false);
  };

  const handleConfirmDestination = () => {
    setIsConfirmed(true);
  };

  const GLOBE_PANEL_MIN_PX = 280;
  const GLOBE_PANEL_MAX_PERCENT = 81;
  const GLOBE_PANEL_DEFAULT_PERCENT = 56;
  const [globePanelWidthPercent, setGlobePanelWidthPercent] = useState(GLOBE_PANEL_DEFAULT_PERCENT);
  const [isResizing, setIsResizing] = useState(false);
  const [globePanelExpanded, setGlobePanelExpanded] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleResizeMove = useCallback(
    (e: MouseEvent) => {
      if (!containerRef.current || !isResizing) return;
      const rect = containerRef.current.getBoundingClientRect();
      const containerWidth = rect.width;
      const mouseX = e.clientX - rect.left;
      const rightPanelWidthPx = containerWidth - mouseX;
      const percent = (rightPanelWidthPx / containerWidth) * 100;
      const minPercent = (GLOBE_PANEL_MIN_PX / containerWidth) * 100;
      const clamped = Math.min(GLOBE_PANEL_MAX_PERCENT, Math.max(minPercent, percent));
      setGlobePanelWidthPercent(clamped);
    },
    [isResizing]
  );

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (!isResizing) return;
    window.addEventListener("mousemove", handleResizeMove);
    window.addEventListener("mouseup", handleResizeEnd);
    return () => {
      window.removeEventListener("mousemove", handleResizeMove);
      window.removeEventListener("mouseup", handleResizeEnd);
    };
  }, [isResizing, handleResizeMove, handleResizeEnd]);

  const showGlobe = !hasMessages || isConfirmed;
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

  if (isConfirmed) {
    return (
      <div
        ref={containerRef}
        className={cn(
          "relative flex flex-row h-full bg-background p-4 overflow-hidden select-none",
          isResizing && "cursor-col-resize",
          className
        )}
      >
        <button
          type="button"
          onClick={() => setGlobePanelExpanded((e) => !e)}
          className="fixed top-4 right-4 z-[100] flex h-10 w-10 items-center justify-center text-foreground hover:opacity-80 focus:outline-none focus:ring-0 active:bg-transparent [-webkit-tap-highlight-color:transparent]"
          aria-label={globePanelExpanded ? "Hide globe" : "Show globe"}
        >
          <Earth className="h-5 w-5 shrink-0" />
        </button>
        <div className="flex-1 min-w-0 flex flex-col min-h-0 transition-all duration-500 ease-smooth animate-in slide-in-from-top-4 fade-in-0">
          <div className="flex-1 min-h-0 overflow-auto" />
          <div className="w-full max-w-[calc(48rem+8rem)] mx-auto mt-4 shrink-0 flex flex-col gap-3">
            <div className="flex-1 min-w-0">
              <ChatInput
                onSend={handleSend}
                mode={mode}
                onModeChange={handleModeChange}
                onInputChange={setExploreInput}
                value={exploreInput}
                showModeSelector={true}
                selectedCountry={null}
                onCountrySelect={handleCountrySelect}
                onChangeDestination={handleChangeDestination}
                onConfirmDestination={handleConfirmDestination}
                isConfirmed={true}
              />
            </div>
          </div>
        </div>
        {globePanelExpanded && (
          <>
            <div
              role="separator"
              aria-orientation="vertical"
              aria-label="Resize globe panel"
              onMouseDown={() => setIsResizing(true)}
              className={cn(
                "w-2 shrink-0 flex items-center justify-center bg-border hover:bg-muted-foreground/20 cursor-col-resize transition-colors group",
                isResizing && "bg-primary/30"
              )}
            >
              <div className="flex flex-col gap-0.5">
                <GripVertical className="size-3.5 text-muted-foreground/60 group-hover:text-muted-foreground" />
              </div>
            </div>
            <div
              style={{ width: `${globePanelWidthPercent}%`, minWidth: GLOBE_PANEL_MIN_PX }}
              className="min-h-0 flex flex-col items-center justify-center overflow-hidden pl-4 transition-[width] duration-150 ease-out animate-in slide-in-from-right-4 fade-in-0"
            >
              <div className="w-full h-full flex-1 min-h-0">
                <ExploreGlobe
                  className="w-full h-full"
                  highlightedCountry={highlightedCountry}
                  centerOnCountry={centerOnCountry}
                  onCountrySelect={isConfirmed ? undefined : handleCountrySelect}
                  isConfirmed={isConfirmed}
                />
              </div>
              <div className="flex items-center justify-center mt-2 mb-2 font-departure-mono text-foreground text-[0.875rem] shrink-0">
                <span>Drag to rotate · Click to select</span>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  if (hasMessages) {
    return (
      <div className={cn("flex flex-col h-full bg-background p-4", className)}>
        <div className="flex-1 min-h-0" />
        <div className="flex items-center gap-2 w-full max-w-[calc(48rem+8rem)] mx-auto">
          <div className="flex-1 min-w-0 max-w-3xl">
            <ChatInput
              onSend={handleSend}
              mode={mode}
              onModeChange={handleModeChange}
              onInputChange={setExploreInput}
              value={exploreInput}
              showModeSelector={!!selectedCountry}
              selectedCountry={selectedCountry}
              onCountrySelect={handleCountrySelect}
              onChangeDestination={handleChangeDestination}
              onConfirmDestination={handleConfirmDestination}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative grid h-full bg-background p-4 transition-[grid-template-rows] duration-500 ease-smooth",
        globePanelExpanded ? "grid-rows-[auto_1fr]" : "grid-rows-1",
        className
      )}
    >
      <button
        type="button"
        onClick={() => setGlobePanelExpanded((e) => !e)}
        className="fixed top-4 right-4 z-[100] flex h-10 w-10 items-center justify-center text-foreground hover:opacity-80 focus:outline-none focus:ring-0 active:bg-transparent [-webkit-tap-highlight-color:transparent]"
        aria-label={globePanelExpanded ? "Hide globe" : "Show globe"}
      >
        <Earth className="h-5 w-5 shrink-0" />
      </button>
      <div className="flex min-h-0 flex-col justify-start">
        <div className="w-full max-w-[calc(48rem+8rem)] mx-auto mb-4 shrink-0 flex items-center gap-2">
          <div className="flex-1 min-w-0 max-w-3xl">
            <ChatInput
              onSend={handleSend}
              mode={mode}
              onModeChange={handleModeChange}
              onInputChange={setExploreInput}
              value={exploreInput}
              showModeSelector={true}
              selectedCountry={selectedCountry}
              onCountrySelect={handleCountrySelect}
              onChangeDestination={handleChangeDestination}
              onConfirmDestination={handleConfirmDestination}
            />
          </div>
        </div>
      </div>
      {globePanelExpanded && (
        <div className="min-h-0 flex flex-col items-center justify-center overflow-hidden">
          <div className="w-full max-w-3xl h-full flex-1 min-h-0">
            <ExploreGlobe
              className="w-full h-full"
              highlightedCountry={highlightedCountry}
              centerOnCountry={centerOnCountry}
              onCountrySelect={handleCountrySelect}
            />
          </div>
          <div className="flex items-center justify-center mt-2 mb-2 font-departure-mono text-foreground text-[0.875rem] shrink-0">
            <span>Drag to rotate · Click to select</span>
          </div>
        </div>
      )}
    </div>
  );
}
