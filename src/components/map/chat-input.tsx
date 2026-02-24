"use client"

import {
  PromptInput,
  PromptInputAction,
  PromptInputTextarea,
} from "@/components/prompt-kit/prompt-input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowUp, Compass, Map, CreditCard, ChevronDown, Square } from "lucide-react"
import { useEffect, useState } from "react"

const PLACEHOLDERS = [
  "Plan a 5-day Italy trip in September",
  "Things to do in Lisbon in April",
  "Find flights NYC → Tokyo next month",
  "Weekend trip ideas from Chicago",
  "Book a hotel in Barcelona in May",
]

type ChatMode = "explore" | "plan" | "book"

const MODE_LABELS: Record<ChatMode, string> = {
  explore: "Explore",
  plan: "Plan",
  book: "Book",
}

export function ChatInput({ onSend }: { onSend?: (message: string) => void }) {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [placeholder, setPlaceholder] = useState(PLACEHOLDERS[0])
  const [mode, setMode] = useState<ChatMode>("explore")

  useEffect(() => {
    setPlaceholder(PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)])
  }, [])

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
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 shrink-0 gap-1.5 rounded-full px-3 font-departure-mono text-sm"
            >
              {mode === "explore" && <Compass className="size-4 shrink-0" />}
              {mode === "plan" && <Map className="size-4 shrink-0" />}
              {mode === "book" && <CreditCard className="size-4 shrink-0" />}
              {MODE_LABELS[mode]}
              <ChevronDown className="size-4 shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="font-departure-mono">
            <DropdownMenuItem onClick={() => setMode("explore")}>
              <Compass className="size-4" />
              Explore
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setMode("plan")}>
              <Map className="size-4" />
              Plan
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setMode("book")}>
              <CreditCard className="size-4" />
              Book
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <PromptInputTextarea placeholder={placeholder} className="min-h-0 py-0 flex-1" />

        <PromptInputAction
          tooltip={isLoading ? "Stop generation" : "Send message"}
        >
          <Button
            variant="default"
            size="icon"
            className="h-8 w-8 shrink-0 rounded-full"
            onClick={handleSubmit}
          >
            {isLoading ? (
              <Square className="size-4 fill-current" />
            ) : (
              <ArrowUp className="size-4" />
            )}
          </Button>
        </PromptInputAction>
      </div>
    </PromptInput>
  )
}
