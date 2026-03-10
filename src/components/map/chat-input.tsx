"use client"

import {
  PromptInput,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/prompt-kit/prompt-input"
import { PromptSuggestion } from "@/components/prompt-kit/prompt-suggestion"
import { Button } from "@/components/ui/button"
import { PrimaryGrowButton } from "@/components/ui/grow-button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Compass, Map, CreditCard, ChevronDown, Square, Send, Telescope, Notebook, Receipt } from "lucide-react"
import { useState, useMemo } from "react"
import { getMatchingCountries, findMatchingCountry } from "@/data/globe-countries"
import { cn } from "@/lib/utils"

export type ChatMode = "explore" | "plan" | "book"

const MODE_CONFIG: Record<ChatMode, { label: string; icon: typeof Compass; submitIcon: typeof Telescope }> = {
  explore: { label: "Explore", icon: Compass, submitIcon: Telescope },
  plan: { label: "Plan", icon: Map, submitIcon: Notebook },
  book: { label: "Book", icon: CreditCard, submitIcon: Receipt },
}

const MODE_PLACEHOLDERS: Record<ChatMode, string> = {
  explore: "Explore a country – type to search",
  plan: "Plan a trip – choose your destination",
  book: "Book your trip – pick a destination",
} as const

function getContextualPlaceholder(mode: ChatMode, _selectedCountry: string): string {
  const placeholders: Record<ChatMode, string> = {
    explore: "Where do you want to go?",
    plan: "What do you want to do when you're there?",
    book: "How do you want to get there?",
  }
  return placeholders[mode] ?? MODE_PLACEHOLDERS[mode]
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
  const isControlled = valueProp !== undefined
  const inputValue = isControlled ? valueProp : input
  const [isLoading, setIsLoading] = useState(false)
  const [internalMode, setInternalMode] = useState<ChatMode>("explore")
  const mode = modeProp ?? internalMode
  const setMode = onModeChange ?? setInternalMode
  const { icon: ModeIcon, label: modeLabel, submitIcon: SubmitIcon } = MODE_CONFIG[mode]

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

  const SubmitIconComponent = showModeSelector ? SubmitIcon : Send

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

  return (
    <div className="relative w-full min-w-0 max-w-full">
      <PromptInput
        value={inputValue}
        onValueChange={setInputValue}
        isLoading={isLoading}
        onSubmit={handleSubmit}
        maxHeight={240}
        className="w-full max-w-full border-input bg-background border shadow-xs"
      >
        <PromptInputTextarea
          placeholder={placeholder}
          className="min-h-[44px]"
        />
        <PromptInputActions
          className={cn(
            "flex items-center gap-2",
            showModeSelector ? "justify-between" : "justify-end"
          )}
        >
          {showModeSelector ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <PrimaryGrowButton
                  type="button"
                  size="sm"
                  className="h-9 shrink-0 gap-1.5 rounded-full px-3 font-departure-mono text-sm"
                >
                  <ModeIcon className="size-4 shrink-0" />
                  {modeLabel}
                  <ChevronDown className="size-4 shrink-0" />
                </PrimaryGrowButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="font-departure-mono">
                {(Object.keys(MODE_CONFIG) as ChatMode[]).map((m) => {
                  const { icon: Icon, label } = MODE_CONFIG[m];
                  return (
                    <DropdownMenuItem key={m} onClick={() => { setMode(m); setInputValue("") }}>
                      <Icon className="size-4" />
                      {label}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div />
          )}
          <Button
            size="sm"
            className="h-9 w-9 shrink-0 rounded-full"
            onClick={handleSubmit}
            disabled={!inputValue.trim()}
          >
            {isLoading ? (
              <Square className="h-4 w-4 fill-current" />
            ) : (
              <SubmitIconComponent className="h-4 w-4" />
            )}
          </Button>
        </PromptInputActions>
      </PromptInput>

      {countrySuggestions.length > 0 && !isConfirmed && (
        <div
          className={cn(
            "absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-lg border border-border bg-popover py-1 shadow-md",
            "font-departure-mono"
          )}
        >
          {countrySuggestions.slice(0, 12).map((country) => (
            <PromptSuggestion
              key={country}
              variant="ghost"
              size="sm"
              onClick={() => handleSelectCountry(country)}
              className="w-full justify-start rounded-xl font-departure-mono text-sm"
            >
              {country}
            </PromptSuggestion>
          ))}
          {countrySuggestions.length > 12 && (
            <div className="px-4 py-2 text-xs text-muted-foreground">
              +{countrySuggestions.length - 12} more
            </div>
          )}
        </div>
      )}
    </div>
  )
}
