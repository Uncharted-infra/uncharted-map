import { cn } from "@/lib/utils";

type Tone = "strawberry" | "matcha" | "blueberry" | "caramel" | "ink" | "vanilla";

const tones: Record<Tone, string> = {
  strawberry: "bg-strawberry text-white",
  matcha: "bg-matcha text-white",
  blueberry: "bg-blueberry text-white",
  caramel: "bg-caramel text-white",
  ink: "bg-ink text-cream",
  vanilla: "bg-vanilla text-ink border border-line",
};

export function Badge({
  tone = "ink",
  tilt = true,
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: Tone; tilt?: boolean }) {
  return (
    <span
      className={cn(
        "inline-block rounded-md px-2 py-0.5 font-mono text-[11px] font-bold tracking-wide uppercase",
        tones[tone],
        tilt && "-rotate-2",
        className
      )}
      {...props}
    />
  );
}
