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
import { useState } from "react"

type ChatMode = "explore" | "plan" | "book"

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

export function ChatInput({ onSend }: { onSend?: (message: string) => void }) {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [mode, setMode] = useState<ChatMode>("explore")

  const placeholder = MODE_PLACEHOLDERS[mode]

  const handleSubmit = () => {
    if (input.trim()) {
      setIsLoading(true)
      onSend?.(input.trim())
      setTimeout(() => {
        setIsLoading(false)
        setInput("")
      }, 500)
    }
  }

  const SubmitIcon = MODE_SUBMIT_ICONS[mode]

  return (
    <PromptInput
      value={input}
      onValueChange={setInput}
      isLoading={isLoading}
      onSubmit={handleSubmit}
      maxHeight={120}
      className="w-full"
    >
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
                setInput("")
              }}
            >
              <Compass className="size-4" />
              Explore
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setMode("plan")
                setInput("")
              }}
            >
              <Map className="size-4" />
              Plan
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setMode("book")
                setInput("")
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
          {!input && (
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
    </PromptInput>
  )
}
