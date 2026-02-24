"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
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
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme("light")}
        className={cn(
          "h-8 shrink-0 border-0 shadow-none hover:bg-transparent hover:shadow-md active:shadow-none transition-shadow duration-200",
          collapsed ? "w-8" : "flex-1 min-w-0"
        )}
        aria-label=" Light mode"
        title=" Light"
      >
        <Sun className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme("dark")}
        className={cn(
          "h-8 shrink-0 border-0 shadow-none hover:bg-transparent hover:shadow-md active:shadow-none transition-shadow duration-200",
          collapsed ? "w-8" : "flex-1 min-w-0"
        )}
        aria-label="Dark mode"
        title="Dark"
      >
        <Moon className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme("system")}
        className={cn(
          "h-8 shrink-0 border-0 shadow-none hover:bg-transparent hover:shadow-md active:shadow-none transition-shadow duration-200",
          collapsed ? "w-8" : "flex-1 min-w-0"
        )}
        aria-label="System theme"
        title="System"
      >
        <Monitor className="h-4 w-4" />
      </Button>
    </div>
  );
}
