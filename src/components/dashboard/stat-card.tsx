import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const TONES = {
  main: "bg-main text-main-foreground",
  blue: "bg-blue",
  white: "bg-secondary-background",
  sand: "bg-sand-deep",
} as const;

const HINT_TONES = {
  matcha: "rounded-base border-2 border-border bg-blue px-1.5 text-foreground",
  strawberry: "rounded-base border-2 border-border bg-main px-1.5 text-main-foreground",
  muted: "text-muted-foreground",
} as const;

export function StatCard({
  label,
  value,
  hint,
  hintTone = "muted",
  tone = "white",
}: {
  label: string;
  value: string;
  hint?: string;
  hintTone?: "muted" | "matcha" | "strawberry";
  tone?: keyof typeof TONES;
}) {
  const onMain = tone === "main";
  return (
    <Card className={cn("p-5", TONES[tone])}>
      <p
        className={cn(
          "font-mono text-[11px] font-bold uppercase",
          onMain && "text-main-foreground/80"
        )}
      >
        {label}
      </p>
      <p className="mt-2 font-display text-3xl font-extrabold tabular-nums">{value}</p>
      {hint && (
        <p className={cn("mt-1 w-fit font-mono text-xs font-bold", HINT_TONES[hintTone])}>
          {hint}
        </p>
      )}
    </Card>
  );
}
