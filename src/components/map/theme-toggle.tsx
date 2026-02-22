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
          "flex flex-col gap-1 p-2 rounded-lg bg-muted/50",
          collapsed && "items-center"
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
        "flex flex-col gap-1 p-2 rounded-lg bg-muted/50",
        collapsed && "items-center"
      )}
    >
      <Button
        variant={theme === "light" ? "secondary" : "ghost"}
        size="icon"
        onClick={() => setTheme("light")}
        className={cn("h-8 w-8 shrink-0", theme === "light" && "bg-background")}
        aria-label="Light mode"
        title="Light"
      >
        <Sun className="h-4 w-4" />
      </Button>
      <Button
        variant={theme === "dark" ? "secondary" : "ghost"}
        size="icon"
        onClick={() => setTheme("dark")}
        className={cn("h-8 w-8 shrink-0", theme === "dark" && "bg-background")}
        aria-label="Dark mode"
        title="Dark"
      >
        <Moon className="h-4 w-4" />
      </Button>
      <Button
        variant={theme === "system" ? "secondary" : "ghost"}
        size="icon"
        onClick={() => setTheme("system")}
        className={cn("h-8 w-8 shrink-0", theme === "system" && "bg-background")}
        aria-label="System theme"
        title="System"
      >
        <Monitor className="h-4 w-4" />
      </Button>
    </div>
  );
}
