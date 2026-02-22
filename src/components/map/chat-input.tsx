"use client";

import { useState, useEffect } from "react";
import { Send, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const PLACEHOLDERS = [
  "Plan a 5-day Italy trip in September",
  "Things to do in Lisbon in April",
  "Find flights NYC → Tokyo next month",
  "Weekend trip ideas from Chicago",
  "Book a hotel in Barcelona in May",
];

export function ChatInput({ onSend }: { onSend?: (message: string) => void }) {
  const [value, setValue] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  // Rotate placeholder after hydration to avoid server/client mismatch
  useEffect(() => {
    setPlaceholderIndex(Math.floor(Math.random() * PLACEHOLDERS.length));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed) {
      onSend?.(trimmed);
      setValue("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t bg-background">
      <div className="flex gap-2 items-end">
        <Button type="button" variant="ghost" size="icon" className="shrink-0">
          <Paperclip className="h-4 w-4" />
        </Button>
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={PLACEHOLDERS[placeholderIndex]}
          className="min-h-[80px] max-h-[200px] resize-none font-fenix"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <Button type="submit" size="icon" className="shrink-0 h-10 w-10">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
