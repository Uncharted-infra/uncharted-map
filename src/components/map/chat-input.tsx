"use client"

import {
  PromptInput,
  PromptInputAction,
  PromptInputTextarea,
} from "@/components/prompt-kit/prompt-input"
import { PrimaryGrowButton } from "@/components/ui/grow-button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Compass, Map, CreditCard, ChevronDown, Square, Send, Telescope, Notebook, Receipt } from "lucide-react"
import { useState, useMemo, useRef, useLayoutEffect } from "react"
import { getMatchingCountries, findMatchingCountry } from "@/data/globe-countries"
import { cn } from "@/lib/utils"

export type ChatMode = "explore" | "plan" | "book"

const MODE_LABELS: Record<ChatMode, string> = {
  explore: "Explore",
  plan: "Plan",
  book: "Book",
}

const MODE_PLACEHOLDERS: Record<ChatMode, string> = {
  explore: "Where do you want to go next?",
  plan: "What do you want to do when you reach there?",
  book: "How do you want to get there?",
} as const

function getContextualPlaceholder(mode: ChatMode, selectedCountry: string): string {
  switch (mode) {
    case "explore":
      return `What would you like to know about ${selectedCountry}?`
    case "plan":
      return `What do you want to do when you reach ${selectedCountry}?`
    case "book":
      return `How do you want to travel to ${selectedCountry}?`
    default:
      return MODE_PLACEHOLDERS[mode]
  }
}

const MODE_SUBMIT_ICONS: Record<ChatMode, typeof Telescope> = {
  explore: Telescope,
  plan: Notebook,
  book: Receipt,
}

export function ChatInput({
  onSend,
  mode: modeProp,
  onModeChange,
  onInputChange,
  value: valueProp,
  showModeSelector = true,
  selectedCountry = null,
  onCountrySelect,
  isConfirmed = false,
}: {
  onSend?: (message: string) => void
  mode?: ChatMode
  onModeChange?: (mode: ChatMode) => void
  onInputChange?: (value: string) => void
  value?: string
  showModeSelector?: boolean
  selectedCountry?: string | null
  onCountrySelect?: (country: string) => void
  isConfirmed?: boolean
}) {
  const [input, setInput] = useState("")
  const [isMultiline, setIsMultiline] = useState(false)
  const isControlled = valueProp !== undefined
  const inputValue = isControlled ? valueProp : input
  const [isLoading, setIsLoading] = useState(false)
  const [internalMode, setInternalMode] = useState<ChatMode>("explore")
  const mode = modeProp ?? internalMode
  const setMode = onModeChange ?? setInternalMode

  const placeholder =
    showModeSelector && selectedCountry
      ? getContextualPlaceholder(mode, selectedCountry)
      : showModeSelector
        ? MODE_PLACEHOLDERS[mode]
        : "Where do you want to go?"

  const handleSubmit = () => {
    const trimmed = inputValue.trim()
    if (!trimmed) return

    const country = findMatchingCountry(trimmed)
    if (country && onCountrySelect) {
      setIsLoading(true)
      onCountrySelect(country)
      setTimeout(() => {
        setIsLoading(false)
        if (!isControlled) setInput("")
        onInputChange?.("")
      }, 300)
      return
    }

    setIsLoading(true)
    onSend?.(trimmed)
    setTimeout(() => {
      setIsLoading(false)
      if (!isControlled) setInput("")
      onInputChange?.("")
    }, 500)
  }

  const setInputValue = (v: string) => {
    if (!isControlled) setInput(v)
    onInputChange?.(v)
  }

  const SubmitIcon = showModeSelector ? MODE_SUBMIT_ICONS[mode] : Send

  const countrySuggestions = useMemo(
    () => (inputValue.trim() ? getMatchingCountries(inputValue) : []),
    [inputValue]
  )

  const handleSelectCountry = (country: string) => {
    if (onCountrySelect) {
      onCountrySelect(country)
    } else {
      setInputValue(country)
    }
  }

  const rulerRef = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const el = rulerRef.current
    if (!el) return
    const height = el.offsetHeight
    setIsMultiline(height > 40)
  }, [inputValue])

  return (
    <PromptInput
      value={inputValue}
      onValueChange={setInputValue}
      isLoading={isLoading}
      onSubmit={handleSubmit}
      maxHeight={120}
      className="w-full min-w-0 max-w-full overflow-visible"
    >
      <div className="relative flex flex-col min-w-0 w-full">
        {/* Hidden ruler: same width as single-line textarea, used for stable multiline detection */}
        <div
          className="absolute inset-0 flex flex-row items-center gap-2 opacity-0 pointer-events-none overflow-hidden"
          aria-hidden
        >
          {showModeSelector && <div className="w-[72px] shrink-0" />}
          <div
            ref={rulerRef}
            className="flex-1 min-w-0 px-2 py-1 text-base font-wenkai-mono-bold whitespace-pre-wrap break-words md:text-sm"
          >
            {inputValue || "\u00a0"}
          </div>
          <div className="w-8 shrink-0" />
        </div>
        <div
          className={cn(
            "flex min-w-0 w-full gap-2",
            isMultiline ? "flex-col items-stretch" : "flex-row items-center"
          )}
        >
        {isMultiline ? (
          <>
            <div className="relative min-h-[24px] min-w-0 w-full flex overflow-hidden">
              <PromptInputTextarea
                placeholder=""
                className="min-h-[24px] min-w-0 flex-1 py-0 bg-transparent max-w-full"
              />
              {!inputValue && !isConfirmed && (
                <div
                  key={showModeSelector ? mode : "country"}
                  className="pointer-events-none absolute inset-0 z-10 flex items-center px-2 py-1 text-base text-muted-foreground md:text-sm font-wenkai-mono-bold select-none animate-icon-mode-change"
                  aria-hidden
                >
                  <span className="pointer-events-none">{placeholder}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 justify-end">
              {showModeSelector && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <PrimaryGrowButton
                      type="button"
                      size="sm"
                      className="h-8 shrink-0 gap-1.5 rounded-full px-3 font-departure-mono text-sm"
                    >
                      {mode === "explore" && <Compass className="size-4 shrink-0" />}
                      {mode === "plan" && <Map className="size-4 shrink-0" />}
                      {mode === "book" && <CreditCard className="size-4 shrink-0" />}
                      {MODE_LABELS[mode]}
                      <ChevronDown className="size-4 shrink-0" />
                    </PrimaryGrowButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="font-departure-mono">
                    <DropdownMenuItem onClick={() => { setMode("explore"); setInputValue("") }}>
                      <Compass className="size-4" />
                      Explore
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { setMode("plan"); setInputValue("") }}>
                      <Map className="size-4" />
                      Plan
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { setMode("book"); setInputValue("") }}>
                      <CreditCard className="size-4" />
                      Book
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <PromptInputAction tooltip={isLoading ? "Stop generation" : "Send message"}>
                <PrimaryGrowButton size="icon" className="h-8 w-8 shrink-0 rounded-full" onClick={handleSubmit}>
                  {isLoading ? (
                    <Square className="size-4 fill-current" />
                  ) : (
                    <span key={mode} className="inline-flex">
                      <SubmitIcon className="size-4 animate-icon-mode-change" />
                    </span>
                  )}
                </PrimaryGrowButton>
              </PromptInputAction>
            </div>
          </>
        ) : (
          <>
            {showModeSelector && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <PrimaryGrowButton
                    type="button"
                    size="sm"
                    className="h-8 shrink-0 gap-1.5 rounded-full px-3 font-departure-mono text-sm"
                  >
                    {mode === "explore" && <Compass className="size-4 shrink-0" />}
                    {mode === "plan" && <Map className="size-4 shrink-0" />}
                    {mode === "book" && <CreditCard className="size-4 shrink-0" />}
                    {MODE_LABELS[mode]}
                    <ChevronDown className="size-4 shrink-0" />
                  </PrimaryGrowButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="font-departure-mono">
                  <DropdownMenuItem onClick={() => { setMode("explore"); setInputValue("") }}>
                    <Compass className="size-4" />
                    Explore
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { setMode("plan"); setInputValue("") }}>
                    <Map className="size-4" />
                    Plan
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { setMode("book"); setInputValue("") }}>
                    <CreditCard className="size-4" />
                    Book
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <div className="relative min-h-[24px] min-w-0 flex-1 flex overflow-hidden">
              <PromptInputTextarea
                placeholder=""
                className="min-h-[24px] min-w-0 flex-1 py-0 bg-transparent max-w-full"
              />
              {!inputValue && !isConfirmed && (
                <div
                  key={showModeSelector ? mode : "country"}
                  className="pointer-events-none absolute inset-0 z-10 flex items-center px-2 py-1 text-base text-muted-foreground md:text-sm font-wenkai-mono-bold select-none animate-icon-mode-change"
                  aria-hidden
                >
                  <span className="pointer-events-none">{placeholder}</span>
                </div>
              )}
            </div>
            <PromptInputAction tooltip={isLoading ? "Stop generation" : "Send message"}>
              <PrimaryGrowButton size="icon" className="h-8 w-8 shrink-0 rounded-full" onClick={handleSubmit}>
                {isLoading ? (
                  <Square className="size-4 fill-current" />
                ) : (
                  <span key={mode} className="inline-flex">
                    <SubmitIcon className="size-4 animate-icon-mode-change" />
                  </span>
                )}
              </PrimaryGrowButton>
            </PromptInputAction>
          </>
        )}
        </div>

        {countrySuggestions.length > 0 && !isConfirmed && (
          <div
            className={cn(
              "absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-lg border border-border bg-popover py-1 shadow-md",
              "font-departure-mono"
            )}
          >
            {countrySuggestions.slice(0, 12).map((country) => (
              <button
                key={country}
                type="button"
                className="w-full px-4 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
                onClick={() => handleSelectCountry(country)}
              >
                {country}
              </button>
            ))}
            {countrySuggestions.length > 12 && (
              <div className="px-4 py-2 text-xs text-muted-foreground">
                +{countrySuggestions.length - 12} more
              </div>
            )}
          </div>
        )}
      </div>
    </PromptInput>
  )
}
