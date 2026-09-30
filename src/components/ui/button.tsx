import { cn } from "@/lib/utils";

type Variant = "caramel" | "ink" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-mono text-[13px] font-bold tracking-wide uppercase transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  caramel: "bg-caramel text-white hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(217,142,50,0.35)]",
  ink: "bg-ink text-cream hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(26,21,18,0.25)]",
  ghost: "border border-line bg-white text-ink hover:-translate-y-0.5 hover:border-ink/30",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-[11px]",
  md: "px-5 py-2.5",
  lg: "px-7 py-3.5 text-sm",
};

export function buttonClasses({
  variant = "caramel",
  size = "md",
  className,
}: {
  variant?: Variant;
  size?: Size;
  className?: string;
} = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

export function Button({
  variant = "caramel",
  size = "md",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
}) {
  return <button className={buttonClasses({ variant, size, className })} {...props} />;
}
