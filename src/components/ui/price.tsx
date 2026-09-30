import { cn } from "@/lib/utils";

export function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export function Price({
  cents,
  className,
}: {
  cents: number;
  className?: string;
}) {
  return <span className={cn("font-mono tabular-nums", className)}>{formatPrice(cents)}</span>;
}
