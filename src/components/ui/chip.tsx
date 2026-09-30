import { cn } from "@/lib/utils";

export function Chip({
  active = false,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      className={cn(
        "inline-flex items-center rounded-full border px-4 py-1.5 font-mono text-xs tracking-wide transition-colors",
        active
          ? "border-ink bg-ink text-cream"
          : "border-line bg-white text-ink hover:border-ink/40",
        className
      )}
      {...props}
    />
  );
}
