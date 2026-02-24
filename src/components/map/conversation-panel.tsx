"use client";

import { useState } from "react";
import { ChatInput } from "./chat-input";
import { cn } from "@/lib/utils";

export function ConversationPanel({ className }: { className?: string }) {
  const [hasMessages, setHasMessages] = useState(false);

  const handleSend = (message: string) => {
    setHasMessages(true);
    // Placeholder for future message handling
    void message;
  };

  if (!hasMessages) {
    return (
      <div
        className={cn(
          "flex flex-col h-full bg-background p-4 justify-center items-center",
          className
        )}
      >
        <p className="font-fenix text-xl text-muted-foreground mb-6">
          Where do you want to go?
        </p>
        <div className="w-full max-w-2xl">
          <ChatInput onSend={handleSend} />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col h-full bg-background p-4", className)}>
      <div className="flex-1 min-h-0" />
      <ChatInput onSend={handleSend} />
    </div>
  );
}
