"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { Earth } from "lucide-react";
import { SIDEBAR_WIDTH_EXPANDED } from "@/contexts/sidebar-context";
import type { ChatMode } from "./chat-input";

const GLOBE_PANEL_WIDTH = Math.round(SIDEBAR_WIDTH_EXPANDED * 2.3);
const GLOBE_SECTION_WIDTH = 24 + 1 + GLOBE_PANEL_WIDTH; // spacer + separator + panel
const GLOBE_ANIMATION_MS = 450;

const ChatInput = dynamic(() => import("./chat-input").then((m) => ({ default: m.ChatInput })), {
  ssr: false,
  loading: () => (
    <div className="w-full min-w-0 max-w-full flex flex-col min-h-0 overflow-hidden rounded-full border border-border bg-card px-4 py-2.5 shadow-sm animate-pulse">
      <div className="h-9 bg-muted/50 rounded-md" />
    </div>
  ),
});
import { ExploreGlobe } from "./explore-globe";
import { findMatchingCountry, COUNTRY_NAMES } from "@/data/globe-countries";
import { getChatState, setChatState } from "@/lib/chat-state";
import { useTrips } from "@/contexts/trips-context";
import { useNewTrip } from "@/contexts/new-trip-context";
import {
  Message,
  MessageAction,
  MessageActions,
  MessageAvatar,
  MessageContent,
} from "@/components/prompt-kit/message";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Check, Copy, ThumbsDown, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function ConversationPanel({ className }: { className?: string }) {
  const { addTrip } = useTrips();
  const newTrip = useNewTrip();
  const [hasMessages, setHasMessages] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [mode, setMode] = useState<ChatMode>("explore");
  const [exploreInput, setExploreInput] = useState("");
  const [liked, setLiked] = useState<boolean | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const stored = getChatState();
    if (stored.country && COUNTRY_NAMES.includes(stored.country)) {
      setSelectedCountry(stored.country);
      setMode(stored.mode);
    }
  }, []);

  useEffect(() => {
    if (newTrip?.resetKey) {
      setHasMessages(false);
      setIsConfirmed(false);
      setSelectedCountry(null);
      setMode("explore");
      setExploreInput("");
    }
  }, [newTrip?.resetKey]);

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
    if (!value) return;
    setSelectedCountry(value);
    setChatState(value, mode);
    setExploreInput("");
    addTrip(value, mode);
    setIsConfirmed(true);
  };

  const AGENT_MESSAGE_TEXT =
    "I can help with a variety of tasks: answering questions, providing information, assisting with coding, generating creative content. What would you like help with today?";

  const handleCopyAgentMessage = () => {
    navigator.clipboard.writeText(AGENT_MESSAGE_TEXT).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const [globePanelExpanded, setGlobePanelExpanded] = useState(true);
  const [isGlobeExiting, setIsGlobeExiting] = useState(false);
  const [globeExpandReady, setGlobeExpandReady] = useState(true);
  const prevGlobeExpandedRef = useRef(true);

  useEffect(() => {
    if (globePanelExpanded && !isGlobeExiting) {
      const isOpening = prevGlobeExpandedRef.current === false;
      prevGlobeExpandedRef.current = true;
      if (isOpening) {
        setGlobeExpandReady(false);
        const id = requestAnimationFrame(() => setGlobeExpandReady(true));
        return () => cancelAnimationFrame(id);
      }
    } else {
      prevGlobeExpandedRef.current = globePanelExpanded;
    }
  }, [globePanelExpanded, isGlobeExiting]);

  const handleGlobeToggle = () => {
    if (globePanelExpanded && !isGlobeExiting) {
      setIsGlobeExiting(true);
    } else if (!globePanelExpanded) {
      setGlobePanelExpanded(true);
    }
  };

  const handleGlobeExitEnd = () => {
    if (isGlobeExiting) {
      setIsGlobeExiting(false);
      setGlobePanelExpanded(false);
    }
  };

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
        className={cn(
          "relative flex flex-row h-full bg-background overflow-hidden select-none",
          className
        )}
      >
        <button
          type="button"
          onClick={handleGlobeToggle}
          className="fixed top-4 right-4 z-[100] flex h-10 w-10 items-center justify-center text-foreground hover:opacity-80 focus:outline-none focus:ring-0 active:bg-transparent [-webkit-tap-highlight-color:transparent]"
          aria-label={globePanelExpanded ? "Hide globe" : "Show globe"}
        >
          <Earth className="h-5 w-5 shrink-0" />
        </button>
        <div className="flex-1 min-w-0 flex flex-col min-h-0 pt-4 pb-4 pl-4 pr-0 overflow-hidden">
          <div className="flex-1 min-h-0 overflow-auto min-w-0 flex flex-col items-center">
            <TooltipProvider delayDuration={0}>
              <div className="flex flex-col gap-8 w-full min-w-0 max-w-2xl px-4 py-6 mx-auto">
                <Message className="justify-end min-w-0 w-full max-w-full">
                  <MessageContent className="min-w-0">
                    {selectedCountry
                      ? `I'd like to explore ${selectedCountry}`
                      : "Hello! How can I help you today?"}
                  </MessageContent>
                </Message>

                <Message className="justify-start items-center min-w-0 w-full max-w-full">
                  <MessageAvatar src="/img/logo/logo.png" alt="Uncharted" fallback="U" className="self-center shrink-0 -mt-[45px]" />
                  <div className="flex w-full min-w-0 flex-col gap-2">
                    <MessageContent markdown className="bg-transparent p-0 font-fenix min-w-0">
                      {AGENT_MESSAGE_TEXT}
                    </MessageContent>

                    <MessageActions className="self-end">
                      <MessageAction tooltip={copied ? "Copied!" : "Copy to clipboard"}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full transition-colors duration-150 ease-out"
                          onClick={handleCopyAgentMessage}
                        >
                          {copied ? (
                            <Check className="size-4 text-green-500 transition-colors duration-200" />
                          ) : (
                            <Copy className="size-4" />
                          )}
                        </Button>
                      </MessageAction>

                      <MessageAction tooltip="Helpful">
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn(
                            "h-8 w-8 rounded-full transition-colors duration-150 ease-out",
                            liked === true && "bg-green-100 text-green-500 dark:bg-green-950 dark:text-green-400"
                          )}
                          onClick={() => {
                            setLiked(true);
                            setTimeout(() => setLiked(null), 400);
                          }}
                        >
                          <ThumbsUp className="size-4" />
                        </Button>
                      </MessageAction>

                      <MessageAction tooltip="Not helpful">
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn(
                            "h-8 w-8 rounded-full transition-colors duration-150 ease-out",
                            liked === false && "bg-red-100 text-red-500 dark:bg-red-950 dark:text-red-400"
                          )}
                          onClick={() => {
                            setLiked(false);
                            setTimeout(() => setLiked(null), 400);
                          }}
                        >
                          <ThumbsDown className="size-4" />
                        </Button>
                      </MessageAction>
                    </MessageActions>
                  </div>
                </Message>
              </div>
            </TooltipProvider>
          </div>
          <div className="w-full min-w-0 max-w-2xl mt-4 shrink-0 flex flex-col gap-3 px-4 overflow-visible mx-auto">
            <div className="min-w-0 w-full overflow-visible">
              <ChatInput
                onSend={handleSend}
                mode={mode}
                onModeChange={handleModeChange}
                onInputChange={setExploreInput}
                value={exploreInput}
                showModeSelector={true}
                selectedCountry={selectedCountry}
                onCountrySelect={handleCountrySelect}
                isConfirmed={true}
              />
            </div>
          </div>
        </div>
        {(globePanelExpanded || isGlobeExiting) && (
          <div
            className="shrink-0 overflow-hidden self-stretch min-h-0"
            style={{
              width: isGlobeExiting ? 0 : globeExpandReady ? GLOBE_SECTION_WIDTH : 0,
              transition: `width ${GLOBE_ANIMATION_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
            }}
          >
            <div
              className={cn(
                "flex flex-row self-stretch min-h-0 h-full",
                isGlobeExiting ? "animate-globe-slide-out" : "animate-globe-slide-in"
              )}
              onAnimationEnd={(e) => {
                if (e.target === e.currentTarget && isGlobeExiting) handleGlobeExitEnd();
              }}
              style={{ width: GLOBE_SECTION_WIDTH, minWidth: GLOBE_SECTION_WIDTH }}
            >
              <div className="w-6 shrink-0" aria-hidden />
              <div
                role="separator"
                aria-orientation="vertical"
                className="w-px shrink-0 self-stretch border-l border-border bg-transparent"
              />
              <div
                style={{ width: GLOBE_PANEL_WIDTH }}
                className="shrink-0 self-stretch min-h-0 flex flex-col items-center justify-center overflow-hidden pl-4 pr-4"
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
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (hasMessages) {
    return (
      <div className={cn("flex flex-col h-full bg-background p-4 min-w-0 overflow-hidden", className)}>
        <div className="flex-1 min-h-0" />
        <div className="flex items-center gap-2 w-full min-w-0 max-w-full overflow-visible">
          <div className="flex-1 min-w-0 w-full overflow-visible">
            <ChatInput
              onSend={handleSend}
              mode={mode}
              onModeChange={handleModeChange}
              onInputChange={setExploreInput}
              value={exploreInput}
              showModeSelector={!!selectedCountry}
              selectedCountry={selectedCountry}
              onCountrySelect={handleCountrySelect}
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
      <div className="flex min-h-0 flex-col justify-start min-w-0 overflow-visible">
        <div className="w-full min-w-0 max-w-full mb-4 shrink-0 flex items-center gap-2 overflow-visible">
          <div className="flex-1 min-w-0 w-full overflow-visible">
            <ChatInput
              onSend={handleSend}
              mode={mode}
              onModeChange={handleModeChange}
              onInputChange={setExploreInput}
              value={exploreInput}
              showModeSelector={true}
              selectedCountry={selectedCountry}
              onCountrySelect={handleCountrySelect}
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
