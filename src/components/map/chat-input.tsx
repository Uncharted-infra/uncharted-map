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
import { Compass, Map, CreditCard, ChevronDown, Square, Telescope, Notebook, Receipt } from "lucide-react"
import { useState, useMemo } from "react"
import { getMatchingCountries } from "@/data/globe-countries"
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
}: {
  onSend?: (message: string) => void
  mode?: ChatMode
  onModeChange?: (mode: ChatMode) => void
  onInputChange?: (value: string) => void
  value?: string
}) {
  const [input, setInput] = useState("")
  const isControlled = valueProp !== undefined
  const inputValue = isControlled ? valueProp : input
  const [isLoading, setIsLoading] = useState(false)
  const [internalMode, setInternalMode] = useState<ChatMode>("explore")
  const mode = modeProp ?? internalMode
  const setMode = onModeChange ?? setInternalMode

  const placeholder = MODE_PLACEHOLDERS[mode]

  const handleSubmit = () => {
    if (inputValue.trim()) {
      setIsLoading(true)
      onSend?.(inputValue.trim())
      setTimeout(() => {
        setIsLoading(false)
        if (!isControlled) setInput("")
        onInputChange?.("")
      }, 500)
    }
  }

  const setInputValue = (v: string) => {
    if (!isControlled) setInput(v)
    onInputChange?.(v)
  }

  const SubmitIcon = MODE_SUBMIT_ICONS[mode]

  const countrySuggestions = useMemo(
    () => (mode === "explore" && inputValue.trim() ? getMatchingCountries(inputValue) : []),
    [mode, inputValue]
  )

  const handleSelectCountry = (country: string) => {
    setInputValue(country)
  }

  return (
    <PromptInput
      value={inputValue}
      onValueChange={setInputValue}
      isLoading={isLoading}
      onSubmit={handleSubmit}
      maxHeight={120}
      className="w-full"
    >
      <div className="relative flex flex-col">
        <div className="flex items-center gap-2">
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
            <DropdownMenuItem
              onClick={() => {
                setMode("explore")
                setInputValue("")
              }}
            >
              <Compass className="size-4" />
              Explore
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setMode("plan")
                setInputValue("")
              }}
            >
              <Map className="size-4" />
              Plan
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setMode("book")
                setInputValue("")
              }}
            >
              <CreditCard className="size-4" />
              Book
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="relative min-h-[24px] min-w-0 flex-1 flex">
          <PromptInputTextarea
            placeholder=""
            className="min-h-[24px] min-w-0 flex-1 py-0 bg-transparent"
          />
          {!inputValue && (
            <div
              key={mode}
              className="pointer-events-none absolute inset-0 z-10 flex items-center px-2 py-1 text-base text-muted-foreground md:text-sm font-wenkai-mono-bold select-none animate-icon-mode-change"
              aria-hidden
            >
              {placeholder}
            </div>
          )}
        </div>

        <PromptInputAction
          tooltip={isLoading ? "Stop generation" : "Send message"}
        >
          <PrimaryGrowButton
            size="icon"
            className="h-8 w-8 shrink-0 rounded-full"
            onClick={handleSubmit}
          >
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

        {mode === "explore" && countrySuggestions.length > 0 && (
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
