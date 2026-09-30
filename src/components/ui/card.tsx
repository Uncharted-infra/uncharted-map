import { cn } from "@/lib/utils";

export function Card({
  className,
  hover = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { hover?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-line bg-white",
        hover && "transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(26,21,18,0.08)]",
        className
      )}
      {...props}
    />
  );
}
