"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { PrimaryGrowButton } from "@/components/ui/grow-button";
import { cn } from "@/lib/utils";

export function ThemeToggle({ collapsed }: { collapsed?: boolean }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={cn(
          "flex gap-1 p-2",
          collapsed ? "flex-col items-center" : "flex-row"
        )}
      >
        <div className="h-8 w-8 shrink-0 rounded-md bg-muted" />
        <div className="h-8 w-8 shrink-0 rounded-md bg-muted" />
        <div className="h-8 w-8 shrink-0 rounded-md bg-muted" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex gap-1 p-2",
        collapsed ? "flex-col items-center w-full" : "flex-row shrink-0"
      )}
    >
      <PrimaryGrowButton
        size="icon"
        onClick={() => setTheme("light")}
        className={cn(
          "h-8 shrink-0 font-departure-mono",
          collapsed ? "w-8" : "flex-1 min-w-0"
        )}
        aria-label=" Light mode"
        title=" Light"
      >
        <Sun className="h-4 w-4" />
      </PrimaryGrowButton>
      <PrimaryGrowButton
        size="icon"
        onClick={() => setTheme("dark")}
        className={cn(
          "h-8 shrink-0 font-departure-mono",
          collapsed ? "w-8" : "flex-1 min-w-0"
        )}
        aria-label="Dark mode"
        title="Dark"
      >
        <Moon className="h-4 w-4" />
      </PrimaryGrowButton>
      <PrimaryGrowButton
        size="icon"
        onClick={() => setTheme("system")}
        className={cn(
          "h-8 shrink-0 font-departure-mono",
          collapsed ? "w-8" : "flex-1 min-w-0"
        )}
        aria-label="System theme"
        title="System"
      >
        <Monitor className="h-4 w-4" />
      </PrimaryGrowButton>
    </div>
  );
}
